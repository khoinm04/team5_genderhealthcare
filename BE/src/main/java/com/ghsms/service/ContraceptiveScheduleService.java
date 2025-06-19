package com.ghsms.service;

import com.ghsms.DTO.ContraceptiveScheduleDTO;
import com.ghsms.config.NotificationWebSocketHandler;
import com.ghsms.model.ContraceptiveSchedule;
import com.ghsms.model.MenstrualCycle;
import com.ghsms.model.Notification;
import com.ghsms.model.User;
import com.ghsms.repository.ContraceptiveScheduleRepository;
import com.ghsms.repository.NotificationRepository;
import com.ghsms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContraceptiveScheduleService {

    private final ContraceptiveScheduleRepository contraceptiveScheduleRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

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
        List<ContraceptiveSchedule> existingSchedules = contraceptiveScheduleRepository.findByUserUserIdAndIsActiveTrue(user.getUserId());
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

        // 3. Lưu xuống database
        ContraceptiveSchedule saved = contraceptiveScheduleRepository.save(schedule);

        // 4. Chuyển object ContraceptiveSchedule sang DTO để trả về FE
        return toDTO(saved);
    }

    /**
     * Lấy toàn bộ lịch uống thuốc còn active của một user
     */
    public List<ContraceptiveScheduleDTO> getSchedulesByUser(Long userId) {
        List<ContraceptiveSchedule> schedules = contraceptiveScheduleRepository.findByUserUserIdAndIsActiveTrue(userId);
        return schedules.stream().map(this::toDTO).collect(Collectors.toList());
    }

    /**
     * Xác nhận user đã uống thuốc hôm nay
     * - Tăng chỉ số currentIndex lên 1
     * - Nếu hết vỉ thì quay lại viên đầu (currentIndex = 0)
     */
    public void confirmTaken(Long scheduleId) {
        // 1. Tìm schedule theo id
        Optional<ContraceptiveSchedule> optionalSchedule = contraceptiveScheduleRepository.findById(scheduleId);
        if (optionalSchedule.isEmpty()) {
            throw new RuntimeException("Không tìm thấy lịch uống thuốc với id " + scheduleId);
        }
        ContraceptiveSchedule schedule = optionalSchedule.get();

        // 2. Xác định tổng số viên theo loại vỉ
        int maxPill = schedule.getType().equals("21") ? 21 : 28;

        // --- BỔ SUNG LOGIC NGHỈ 7 NGÀY CHO VỈ 21 VIÊN ---
        if (schedule.getType().equals("21")) {
            // Nếu đang trong thời gian nghỉ, không cho xác nhận uống
            if (schedule.getBreakUntil() != null && LocalDate.now().isBefore(schedule.getBreakUntil())) {
                throw new RuntimeException("Hiện tại bạn đang trong thời gian nghỉ 7 ngày, hãy đợi đến " + schedule.getBreakUntil().toString() + " để bắt đầu vỉ mới.");
            }
        }

        // 3. Nếu chưa uống hết vỉ thì tăng currentIndex
        if (schedule.getCurrentIndex() < maxPill - 1) {
            schedule.setCurrentIndex(schedule.getCurrentIndex() + 1);
        } else {
            // Nếu đã uống hết vỉ, quay lại viên đầu tiên
            schedule.setCurrentIndex(0);
            // bổ sung logic nghỉ 7 ngày cho vỉ 21
            if (schedule.getType().equals("21")) {
                // NGHỈ 7 NGÀY
                schedule.setBreakUntil(LocalDate.now().plusDays(7));
            } else {
                schedule.setBreakUntil(null); // Vỉ 28 không có nghỉ
            }
        }

        // 4. Lưu lại trạng thái mới
        contraceptiveScheduleRepository.save(schedule);
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

    @Scheduled(cron = "0 * * * * *", zone = "Asia/Ho_Chi_Minh" ) // Chạy mỗi phút
    public void checkAndSendPillReminders() {
        LocalTime now = LocalTime.now();
        LocalDate today = LocalDate.now();

        // Thêm log để debug
        System.out.println("Đang chạy kiểm tra thuốc lúc: " + now);
        // Lấy tất cả lịch uống thuốc đang active
        List<ContraceptiveSchedule> activeSchedules = contraceptiveScheduleRepository.findByIsActiveTrue();

        for (ContraceptiveSchedule schedule : activeSchedules) {
            // Kiểm tra xem có nên gửi nhắc nhở không
            if (shouldSendPillReminder(schedule, today)) {
                LocalTime pillTime = schedule.getPillTime();

                // Kiểm tra có phải giờ uống thuốc không (với khoảng buffer 5 phút)
                if (isWithinPillTimeWindow(now, pillTime)) {
                    String message = String.format(
                            "Đã đến giờ uống thuốc! Hãy uống viên thứ %d của vỉ %s viên.",
                            schedule.getCurrentIndex() + 1,
                            schedule.getType()
                    );

                    // Gửi thông báo qua WebSocket và lưu DB
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
    private ContraceptiveScheduleDTO toDTO(ContraceptiveSchedule schedule) {
        ContraceptiveScheduleDTO dto = new ContraceptiveScheduleDTO();
        dto.setId(schedule.getId());
        dto.setUserId(schedule.getUser().getUserId());
        dto.setType(schedule.getType());
        dto.setStartDate(schedule.getStartDate());
        dto.setPillTime(schedule.getPillTime());
        dto.setCurrentIndex(schedule.getCurrentIndex());
        dto.setActive(schedule.isActive());
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

        // 2. Gửi real-time qua WebSocket
        NotificationWebSocketHandler.sendNotificationToUser(
                schedule.getUser().getUserId(),
                message
        );

        System.out.println(" Đã gửi thông báo thuốc (DB + WebSocket) cho user: " +
                schedule.getUser().getUserId());
    }
}
