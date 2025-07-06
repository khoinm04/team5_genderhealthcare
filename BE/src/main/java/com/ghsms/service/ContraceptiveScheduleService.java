package com.ghsms.service;

import com.ghsms.DTO.ContraceptiveScheduleDTO;
import com.ghsms.DTO.NotificationDTO;
import com.ghsms.model.ContraceptiveSchedule;
import com.ghsms.model.Notification;
import com.ghsms.model.User;
import com.ghsms.repository.ContraceptiveScheduleRepository;
import com.ghsms.repository.NotificationRepository;
import com.ghsms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContraceptiveScheduleService {

    private final ContraceptiveScheduleRepository contraceptiveScheduleRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    /**
     * Đăng ký lịch uống thuốc mới cho user (FE gửi lên DTO, id = null)
     */
    public ContraceptiveScheduleDTO registerSchedule(ContraceptiveScheduleDTO dto) {
        // 1. Tìm user trong database theo userId
        Optional<User> optionalUser = userRepository.findById(dto.getUserId());
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Không tìm thấy user với id " + dto.getUserId());
        }
        User user = optionalUser.get();

        //kiểm tra xem user đã có lịch uống thuốc nào chưa
        List<ContraceptiveSchedule> existingSchedules = contraceptiveScheduleRepository.findByUserUserIdAndActiveTrue(user.getUserId());
        if (!existingSchedules.isEmpty()) {
            throw new RuntimeException("Bạn đã có lịch uống thuốc tránh thai, không nên đăng ký lịch mới!");
        }

        // 2. Tạo object ContraceptiveSchedule mới và set các trường dữ liệu từ DTO
        ContraceptiveSchedule schedule = new ContraceptiveSchedule();
        schedule.setUser(user);
        schedule.setStartDate(dto.getStartDate());
        schedule.setType(dto.getType());
        schedule.setPillTime(dto.getPillTime());
        schedule.setCurrentIndex(0);  // Luôn bắt đầu từ viên đầu tiên
        schedule.setActive(true);   // Khi tạo luôn ở trạng thái active

        // ✅ THÊM MỚI: Khởi tạo các thuộc tính mới
        schedule.setTakenToday(false);
        schedule.setMissedCount(0);
        schedule.setLastCheckedDate(LocalDate.now());
        schedule.setMissedPillDates(new ArrayList<>()); // Khởi tạo danh sách rỗng
        // 3. Lưu xuống database
        ContraceptiveSchedule saved = contraceptiveScheduleRepository.save(schedule);

        // 4. Chuyển object ContraceptiveSchedule sang DTO để trả về FE
        return toDTO(saved);
    }

    /**
     * Lấy toàn bộ lịch uống thuốc còn active của một user
     */
    public List<ContraceptiveScheduleDTO> getSchedulesByUser(Long userId) {
        List<ContraceptiveSchedule> schedules = contraceptiveScheduleRepository.findByUserUserIdAndActiveTrue(userId);
        return schedules.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Xác nhận user đã uống thuốc hôm nay
     * - Tăng chỉ số currentIndex lên 1
     * - Nếu hết vỉ thì quay lại viên đầu (currentIndex = 0)
     */
    public void confirmTaken(Long scheduleId) {
        Optional<ContraceptiveSchedule> optionalSchedule = contraceptiveScheduleRepository.findById(scheduleId);
        if (optionalSchedule.isEmpty()) {
            throw new RuntimeException("Không tìm thấy lịch uống thuốc với id " + scheduleId);
        }
        ContraceptiveSchedule schedule = optionalSchedule.get();
        LocalDate today = LocalDate.now();

        int maxPill = schedule.getType().equals("21") ? 21 : 28;

        if (schedule.getType().equals("21")) {
            if (schedule.getBreakUntil() != null && LocalDate.now().isBefore(schedule.getBreakUntil())) {
                throw new RuntimeException("Hiện tại bạn đang trong thời gian nghỉ 7 ngày, hãy đợi đến " + schedule.getBreakUntil().toString() + " để bắt đầu vỉ mới.");
            }
        }

        schedule.setTakenToday(true);
        schedule.setLastCheckedDate(today);
        schedule.setMissedCount(0);
        schedule.getMissedPillDates().removeIf(date -> date.equals(today));

        // ✅ Lưu lại index trước khi tăng để hiển thị đúng số viên đã uống
        int indexBeforeIncrease = schedule.getCurrentIndex();

        if (indexBeforeIncrease < maxPill - 1) {
            schedule.setCurrentIndex(indexBeforeIncrease + 1);
        } else {
            schedule.setCurrentIndex(0);
            if (schedule.getType().equals("21")) {
                schedule.setBreakUntil(today.plusDays(7));
            } else {
                schedule.setBreakUntil(null);
            }
        }

        contraceptiveScheduleRepository.saveAndFlush(schedule); // <-- dùng flush để chắc chắn DB được cập nhật trước khi gửi

        // ✅ Dùng indexBeforeIncrease để hiển thị số viên đúng
        String confirmMessage = String.format(
                "✅ Đã xác nhận uống thuốc viên thứ %d của vỉ %s viên. Chúc bạn khỏe mạnh!",
                indexBeforeIncrease + 1,
                schedule.getType()
        );
        createContraceptiveNotification(schedule, confirmMessage);

        log.info("User {} đã uống thuốc ngày {}", schedule.getUser().getUserId(), today);
    }


    public void deleteSchedule(Long scheduleId, Long userId) {
        Optional<ContraceptiveSchedule> optionalSchedule = contraceptiveScheduleRepository.findById(scheduleId);
        if (optionalSchedule.isEmpty()) {
            throw new RuntimeException("Không tìm thấy lịch uống thuốc với id " + scheduleId);
        }
        ContraceptiveSchedule schedule = optionalSchedule.get();

        // Đảm bảo user chỉ được xóa lịch của chính mình
        if (!schedule.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xóa lịch uống thuốc này!");
        }

        // Đánh dấu không còn hoạt động
        schedule.setActive(false);
        contraceptiveScheduleRepository.save(schedule);
    }


    // Kiểm tra có nên gửi nhắc nhở uống thuốc không
    // Logic đơn giản: chỉ kiểm tra ngày hiện tại có phải ngày cần uống thuốc không

    public boolean shouldSendPillReminder(ContraceptiveSchedule contraceptiveSchedule, LocalDate today) {
        // 1. Kiểm tra lịch có active không
        if (!contraceptiveSchedule.isActive()) {
            return false;
        }
        // 2. Nếu đang nghỉ 7 ngày (vỉ 21) thì không uống
        if (contraceptiveSchedule.getBreakUntil() != null &&
                (today.isBefore(contraceptiveSchedule.getBreakUntil()) || today.isEqual(contraceptiveSchedule.getBreakUntil()))) {
            return false;
        }
        // 3. Còn lại thì uống hàng ngày (logic đơn giản)
        return true;
    }

    @Scheduled(cron = "0 * * * * *", zone = "Asia/Ho_Chi_Minh") // Chạy mỗi phút
    public void checkAndSendPillReminders() {
        LocalTime now = LocalTime.now();
        LocalDate today = LocalDate.now();

        System.out.println("Đang chạy kiểm tra thuốc lúc: " + now);

        List<ContraceptiveSchedule> activeSchedules = contraceptiveScheduleRepository.findByActiveTrue();

        for (ContraceptiveSchedule schedule : activeSchedules) {
            if (shouldSendPillReminder(schedule, today)) {

                // ✅ BỎ QUA nếu đã uống hôm nay
                if (schedule.isTakenToday()) {
                    continue;
                }

                LocalTime pillTime = schedule.getPillTime();

                if (isWithinPillTimeWindow(now, pillTime)) {
                    String message = String.format(
                            "Đã đến giờ uống thuốc! Hãy uống viên thứ %d của vỉ %s viên.",
                            schedule.getCurrentIndex() + 1,
                            schedule.getType()
                    );

                    createContraceptiveNotification(schedule, message);
                }
            }
        }
    }


    /**
     * Kiểm tra xem thời gian hiện tại có nằm trong khoảng thời gian uống thuốc không
     * Buffer 5 phút trước và sau giờ uống thuốc
     */
    private boolean isWithinPillTimeWindow(LocalTime now, LocalTime pillTime) {
        LocalTime windowStart = pillTime.minusMinutes(5);
        LocalTime windowEnd = pillTime.plusMinutes(5);

        // Xử lý trường hợp đặc biệt khi thời gian băng qua nửa đêm
        if (windowStart.isAfter(windowEnd)) {
            return !now.isAfter(windowEnd) || !now.isBefore(windowStart);
        }

        return !now.isBefore(windowStart) && !now.isAfter(windowEnd);
    }

    // Chuyển từ entity ContraceptiveSchedule sang DTO cho FE
    public ContraceptiveScheduleDTO toDTO(ContraceptiveSchedule schedule) {
        ContraceptiveScheduleDTO dto = new ContraceptiveScheduleDTO();
        dto.setId(schedule.getId());
        dto.setUserId(schedule.getUser().getUserId());
        dto.setType(schedule.getType());
        dto.setStartDate(schedule.getStartDate());
        dto.setPillTime(schedule.getPillTime());
        dto.setCurrentIndex(schedule.getCurrentIndex());
        dto.setActive(schedule.isActive());

        // ✅ THÊM MỚI: Các thuộc tính mới
        dto.setTakenToday(schedule.isTakenToday());
        dto.setMissedCount(schedule.getMissedCount());
        dto.setLastCheckedDate(schedule.getLastCheckedDate());
        dto.setMissedPillDates(new ArrayList<>(schedule.getMissedPillDates()));
        return dto;
    }

    /**
     * Tạo thông báo uống thuốc VÀ gửi real-time qua WebSocket
     */
    public void createContraceptiveNotification(ContraceptiveSchedule schedule, String message) {
        // 1. Lưu vào database
        Notification notification = new Notification();
        notification.setUser(schedule.getUser());
        notification.setMessage(message);
        notification.setCreatedAt(LocalDateTime.now());
//        notification.setRead(false);
        notificationRepository.save(notification);

        // 2. Gửi qua WebSocket đơn giản
        messagingTemplate.convertAndSend(
                "/topic/user/" + schedule.getUser().getUserId(),
                message
        );

        System.out.println("✅ Đã gửi thông báo cho user: " + schedule.getUser().getUserId());
    }

    /**
     * Kiểm tra quên uống thuốc mỗi ngày lúc 23:59
     * Reset takenToday về false cho ngày mới
     * Tăng missedCount nếu quên uống
     * Xóa lịch nếu quên quá nhiều lần
     */
    @Scheduled(cron = "0 59 23 * * *", zone = "Asia/Ho_Chi_Minh") // 23:59 hàng ngày
    public void checkMissedPillsDaily() {
        LocalDate today = LocalDate.now();
        log.info("🔍 Bắt đầu kiểm tra quên uống thuốc ngày: {}", today);

        List<ContraceptiveSchedule> activeSchedules = contraceptiveScheduleRepository.findByActiveTrue();

        for (ContraceptiveSchedule schedule : activeSchedules) {
            try {
                processScheduleForMissedPills(schedule, today);
            } catch (Exception e) {
                throw new RuntimeException("Lỗi khi kiểm tra quên uống thuốc ngày: " + today);
            }
        }

        log.info("✅ Hoàn thành kiểm tra quên uống thuốc ngày: {}", today);
    }

    /**
     * Xử lý từng lịch uống thuốc để kiểm tra quên uống
     */
    private void processScheduleForMissedPills(ContraceptiveSchedule schedule, LocalDate today) {
        // ✅ Kiểm tra xem có đang trong thời gian nghỉ không
        if (schedule.getType().equals("21") && schedule.getBreakUntil() != null) {
            //sau khi kiểm tra pha bỏ qua dòng này.
            log.info("User {} đang trong thời gian nghỉ, bỏ qua kiểm tra", schedule.getUser().getUserId());
            return;
        }

        // ✅ Kiểm tra xem hôm nay có uống thuốc không
        if (!schedule.isTakenToday()) {
            // Quên uống thuốc
            schedule.setMissedCount(schedule.getMissedCount() + 1);

            // ✅ THÊM MỚI: Thêm ngày hôm nay vào danh sách quên uống
            if (!schedule.getMissedPillDates().contains(today)) {
                schedule.getMissedPillDates().add(today);
            }

            String missedMessage = String.format(
                    "⚠️ Bạn đã quên uống thuốc hôm nay! Đây là lần thứ %d bạn quên uống. " +
                            "Hãy cố gắng uống đều đặn để đảm bảo hiệu quả tránh thai.",
                    schedule.getMissedCount()
            );

            log.warn("User {} quên uống thuốc ngày {}, missed count: {}, total missed dates: {}",
                    schedule.getUser().getUserId(), today, schedule.getMissedCount(),
                    schedule.getMissedPillDates().size());

            // ✅ Kiểm tra xem có cần xóa lịch không
            if (shouldDeleteScheduleForMissedPills(schedule)) {
                deleteScheduleForMissedPills(schedule);
                return; // Không cần xử lý tiếp
            }
        } else {
            log.info("User {} đã uống thuốc ngày {}", schedule.getUser().getUserId(), today);
        }

        // ✅ Reset takenToday cho ngày mới
        schedule.setTakenToday(false);
        schedule.setLastCheckedDate(today);

        contraceptiveScheduleRepository.save(schedule);
    }

    /**
     * Kiểm tra xem có nên xóa lịch do quên uống quá nhiều không
     */
    private boolean shouldDeleteScheduleForMissedPills(ContraceptiveSchedule schedule) {
        if (schedule.getType().equals("21")) {
            return schedule.getMissedCount() > 0; // Vỉ 21: không được quên lần nào
        } else {
            return schedule.getMissedCount() > 3; // Vỉ 28: không được quên quá 3 lần
        }
    }

    /**
     * Xóa lịch uống thuốc do quên uống quá nhiều
     */
    private void deleteScheduleForMissedPills(ContraceptiveSchedule schedule) {
        // ✅ Safe delete: đánh dấu không active thay vì xóa hẳn
        schedule.setActive(false);
        contraceptiveScheduleRepository.save(schedule);

        String deleteMessage = String.format(
                "🚨 Lịch uống thuốc của bạn đã bị tạm dừng do quên uống quá %d lần. " +
                        "Vỉ %s viên yêu cầu uống đều đặn để đảm bảo hiệu quả. " +
                        "Những ngày bạn đã quên: %s. " +
                        "Vui lòng tham khảo ý kiến bác sĩ và đăng ký lịch mới nếu cần.",
                schedule.getMissedCount(),
                schedule.getType(),
                formatMissedDates(schedule.getMissedPillDates())
        );

        createContraceptiveNotification(schedule, deleteMessage);

        log.warn("🚨 Đã xóa lịch uống thuốc cho user {} do quên uống {} lần (vỉ {} viên)",
                schedule.getUser().getUserId(), schedule.getMissedCount(), schedule.getType());
    }

    // Format danh sách ngày quên thành chuỗi dễ đọc

    private String formatMissedDates(List<LocalDate> missedDates) {
        if (missedDates.isEmpty()) {
            return "Không có";
        }

        return missedDates.stream()
                .sorted()
                .map(LocalDate::toString)
                .collect(Collectors.joining(", "));
    }


    public ContraceptiveSchedule getActiveScheduleByUserId(Long userId) {
        return contraceptiveScheduleRepository
                .findByUserUserIdAndActiveTrue(userId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch thuốc đang hoạt động"));
    }

    public Map<String, Boolean> generatePillHistory(ContraceptiveSchedule schedule) {
        Map<String, Boolean> history = new LinkedHashMap<>();
        LocalDate start = schedule.getStartDate();
        int currentIndex = schedule.getCurrentIndex();
        int total = schedule.getType().equals("21") ? 21 : 28;

        for (int i = 0; i < total; i++) {
            LocalDate date = start.plusDays(i);
            history.put(date.toString(), i < currentIndex); // true nếu đã uống
        }

        return history;
    }

    public ContraceptiveSchedule getScheduleById(Long scheduleId) {
        return contraceptiveScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch uống thuốc với id " + scheduleId));
    }


}
