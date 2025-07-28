package com.ghsms.service;

import com.ghsms.DTO.ContraceptiveScheduleDTO;
import com.ghsms.model.ContraceptiveSchedule;
import com.ghsms.model.Notification;
import com.ghsms.model.User;
import com.ghsms.repository.ContraceptiveScheduleRepository;
import com.ghsms.repository.NotificationRepository;
import com.ghsms.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class ContraceptiveScheduleService {

    private final ContraceptiveScheduleRepository contraceptiveScheduleRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;


    public ContraceptiveScheduleDTO registerSchedule(ContraceptiveScheduleDTO dto) {
        Optional<User> optionalUser = userRepository.findById(dto.getUserId());
        if (optionalUser.isEmpty()) {
            throw new RuntimeException("Không tìm thấy user với id " + dto.getUserId());
        }
        User user = optionalUser.get();

        List<ContraceptiveSchedule> existingSchedules = contraceptiveScheduleRepository.findByUserUserIdAndActiveTrue(user.getUserId());
        if (!existingSchedules.isEmpty()) {
            throw new RuntimeException("Bạn đã có lịch uống thuốc tránh thai, không nên đăng ký lịch mới!");
        }

        ContraceptiveSchedule schedule = new ContraceptiveSchedule();
        schedule.setUser(user);
        schedule.setStartDate(dto.getStartDate());

        if(dto.getType().equals("21")){
            schedule.setEndDate(dto.getStartDate().plusDays(27));
            schedule.setStartBreakDay(dto.getStartDate().plusDays(21));
        } else {
            schedule.setEndDate(dto.getStartDate().plusDays(27));
        }

        schedule.setType(dto.getType());
        schedule.setPillTime(dto.getPillTime());
        schedule.setCurrentIndex(-1);
        schedule.setActive(true);
        schedule.setLastCheckedDate(LocalDate.now());
        schedule.setMedicineName(dto.getMedicineName());

        ContraceptiveSchedule saved = contraceptiveScheduleRepository.save(schedule);

        return toDTO(saved);
    }


    public void confirmTaken(Long scheduleId) {
        Optional<ContraceptiveSchedule> optionalSchedule = contraceptiveScheduleRepository.findById(scheduleId);
        if (optionalSchedule.isEmpty()) {
            throw new RuntimeException("Không tìm thấy lịch uống thuốc với id " + scheduleId);
        }

        ContraceptiveSchedule schedule = optionalSchedule.get();
        LocalDate today = LocalDate.now();
        LocalDate startDate = schedule.getStartDate();

        long daysDifference = java.time.temporal.ChronoUnit.DAYS.between(startDate, today);

        if(!schedule.isActive()){
            String message = "Lịch uống thuốc này đã không còn hoạt động, không thể xác nhận uống thuốc!";
            createContraceptiveNotificationWebSocket(schedule, message);
            throw new RuntimeException("Lịch uống thuốc này đã không còn hoạt động, không thể xác nhận uống thuốc!");
        }
        if (daysDifference < 0) {
            String message = "Bạn không thể xác nhận uống thuốc trước ngày bắt đầu!";
            createContraceptiveNotificationWebSocket(schedule, message);
            throw new RuntimeException("Không thể xác nhận uống thuốc trước ngày bắt đầu!");
        }
        int maxPill = schedule.getType().equals("21") ? 21 : 28;

        if(schedule.getEndDate().isBefore(today)) {
            String message = String.format(
                    "Bạn đã uống hết vỉ thuốc này (%s viên), hãy đăng ký vỉ mới!",
                    schedule.getType().equals("21") ? "21" : "28"
            );
            createContraceptiveNotificationWebSocket(schedule, message);
            if( schedule.getType().equals("21")) {
                schedule.setCurrentIndex(20);
            } else {
                schedule.setCurrentIndex(27);
            }
            schedule.setLastCheckedDate(today);
            contraceptiveScheduleRepository.saveAndFlush(schedule);
            return;
        }

        if (schedule.getType().equals("21")) {

            if (daysDifference >= maxPill - 1) {
                String message = "Đã xác nhận bạn uống thuốc hết vĩ 21.";
                createContraceptiveNotificationWebSocket(schedule, message);
                schedule.setCurrentIndex(maxPill - 1);

                schedule.setLastCheckedDate(today);
                contraceptiveScheduleRepository.saveAndFlush(schedule);
                return;
            }

            if (schedule.getStartBreakDay().isEqual(today) || schedule.getStartBreakDay().isBefore(today)) {
                String message = "Đã xác nhận bạn uống thuốc hết vĩ 21.";
                createContraceptiveNotificationWebSocket(schedule, message);
                schedule.setCurrentIndex(maxPill - 1);
                schedule.setLastCheckedDate(today);
                contraceptiveScheduleRepository.saveAndFlush(schedule);
                return;
            }else{
                schedule.setCurrentIndex( (int) daysDifference);
            }
        } else {
            schedule.setCurrentIndex((int) daysDifference);
        }

        schedule.setLastCheckedDate(today);
        contraceptiveScheduleRepository.saveAndFlush(schedule);

        String confirmMessage = String.format(
                "Đã xác nhận uống thuốc viên thứ %d (%s viên). Chúc bạn khỏe mạnh!",
                schedule.getCurrentIndex() + 1,
                schedule.getType()
        );
        createContraceptiveNotification(schedule, confirmMessage);


    }

    public void safeDeleteSchedule(Long scheduleId, Long userId){
        Optional<ContraceptiveSchedule> optionalSchedule = contraceptiveScheduleRepository.findById(scheduleId);
        if (optionalSchedule.isEmpty()) {
            throw new RuntimeException("Không tìm thấy lịch uống thuốc với id " + scheduleId);
        }
        ContraceptiveSchedule schedule = optionalSchedule.get();

        if (!schedule.getUser().getUserId().equals(userId)) {
            String message = "Bạn không có quyền xóa lịch uống thuốc này!";
            createContraceptiveNotificationWebSocket(schedule, message);
            throw new RuntimeException("Bạn không có quyền xóa lịch uống thuốc này!");
        }

        schedule.setActive(false);
        contraceptiveScheduleRepository.save(schedule);
    }

    public void deleteSchedule(Long scheduleId, Long userId) {
        Optional<ContraceptiveSchedule> optionalSchedule = contraceptiveScheduleRepository.findById(scheduleId);
        if (optionalSchedule.isEmpty()) {
            throw new RuntimeException("Không tìm thấy lịch uống thuốc với id " + scheduleId);
        }

        ContraceptiveSchedule schedule = optionalSchedule.get();

        if (!schedule.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xóa lịch uống thuốc này!");
        }

        contraceptiveScheduleRepository.delete(schedule);

    }

    public void updateNote(Long scheduleId, String note, Long userId) {
        Optional<ContraceptiveSchedule> optionalSchedule = contraceptiveScheduleRepository.findById(scheduleId);
        if (optionalSchedule.isEmpty()) {
            throw new RuntimeException("Không tìm thấy lịch uống thuốc với id " + scheduleId);
        }

        ContraceptiveSchedule schedule = optionalSchedule.get();

        if (!schedule.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền cập nhật ghi chú này!");
        }

        schedule.setNote(note);
        contraceptiveScheduleRepository.save(schedule);

    }

    public boolean shouldSendPillReminder(ContraceptiveSchedule contraceptiveSchedule, LocalDate today) {
        if (!contraceptiveSchedule.isActive()) {
            return false;
        }
        if (contraceptiveSchedule.getStartBreakDay()!= null && (contraceptiveSchedule.getStartBreakDay().isBefore(today) || contraceptiveSchedule.getStartBreakDay().isEqual(today))) {
            return false;
        }
        return !contraceptiveSchedule.getEndDate().isBefore(today);
    }

    @Scheduled(cron = "0 * * * * *", zone = "Asia/Ho_Chi_Minh")
    public void checkAndSendPillReminders() {
        LocalTime now = LocalTime.now();
        LocalDate today = LocalDate.now();


        List<ContraceptiveSchedule> activeSchedules = contraceptiveScheduleRepository.findByActiveTrue();

        for (ContraceptiveSchedule schedule : activeSchedules) {
            if (shouldSendPillReminder(schedule, today)) {

                LocalTime pillTime = schedule.getPillTime();

                if (isWithinPillTimeWindow(now, pillTime)) {
                    String message = String.format(
                            "Đã đến giờ uống thuốc tránh thai hằng ngày%s.",
                            schedule.getMedicineName() != null ? " - " + schedule.getMedicineName() : ""
                    );

                    createContraceptiveNotification(schedule, message);
                }
            }
        }
    }


    private boolean isWithinPillTimeWindow(LocalTime now, LocalTime pillTime) {
        return now.getHour() == pillTime.getHour() && now.getMinute() == pillTime.getMinute();
    }

    @Transactional
    public ContraceptiveSchedule updateScheduleAndSaveToHistory(Long scheduleId, Integer currentIndex,
                                                                String note, Long userId) {
        ContraceptiveSchedule schedule = contraceptiveScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch uống thuốc với ID: " + scheduleId));

        if (!schedule.getUser().getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền cập nhật lịch này!");
        }

        int maxIndex = schedule.getType().equals("21") ? 20 : 27;
        if (currentIndex > maxIndex) {
            String message = String.format(
                    "Current index không được vượt quá %d cho vỉ %s viên",
                    maxIndex, schedule.getType()
            );
            createContraceptiveNotificationWebSocket(schedule, message);

            throw new RuntimeException(String.format("Current index không được vượt quá %d cho vỉ %s viên",
                    maxIndex, schedule.getType()));
        }

        schedule.setCurrentIndex(currentIndex);

        if (note != null && !note.trim().isEmpty()) {
            if (schedule.getNote() != null && !schedule.getNote().trim().isEmpty()) {
                schedule.setNote(schedule.getNote());
            }
        }

        schedule.setActive(false);
        schedule.setLastCheckedDate(LocalDate.now());

        ContraceptiveSchedule savedSchedule = contraceptiveScheduleRepository.save(schedule);

        String message = String.format(
                "Đã cập nhật và lưu lịch uống thuốc vào lịch sử. Viên hiện tại: %d/%s",
                currentIndex + 1,
                schedule.getType()
        );
        createContraceptiveNotification(schedule, message);

        return savedSchedule;
    }


    public List<ContraceptiveSchedule> getScheduleHistory(Long userId) {
        return contraceptiveScheduleRepository
                .findByUserUserIdAndActiveFalseOrderByLastCheckedDateDesc(userId);
    }

    public ContraceptiveScheduleDTO toDTO(ContraceptiveSchedule schedule) {
        ContraceptiveScheduleDTO dto = new ContraceptiveScheduleDTO();
        dto.setId(schedule.getId());
        dto.setUserId(schedule.getUser().getUserId());
        dto.setType(schedule.getType());
        dto.setStartDate(schedule.getStartDate());
        dto.setEndDate(schedule.getEndDate());
        dto.setPillTime(schedule.getPillTime());
        dto.setCurrentIndex(schedule.getCurrentIndex());
        dto.setActive(schedule.isActive());
        dto.setLastCheckedDate(schedule.getLastCheckedDate());
        dto.setMedicineName(schedule.getMedicineName());
        dto.setNote(schedule.getNote());
        return dto;
    }


    public void createContraceptiveNotification(ContraceptiveSchedule schedule, String message) {
        Notification notification = new Notification();
        notification.setUser(schedule.getUser());
        notification.setMessage(message);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);

        Map<String, Object> notificationData = Map.of(
                "type", "REMINDER",
                "message", message,
                "timestamp", LocalDateTime.now().toString(),
                "userId", schedule.getUser().getUserId()
        );

        messagingTemplate.convertAndSend(
                "/topic/user/" + schedule.getUser().getUserId(),
                notificationData
        );
        log.info("Đã tạo thông báo cho lịch uống thuốc với ID: {}", schedule.getId());

    }

    public void createContraceptiveNotificationWebSocket(ContraceptiveSchedule schedule, String message) {
        Map<String, Object> notificationData = Map.of(
                "type", "REMINDER",
                "message", message,
                "timestamp", LocalDateTime.now().toString(),
                "userId", schedule.getUser().getUserId()
        );

        messagingTemplate.convertAndSend(
                "/topic/user/" + schedule.getUser().getUserId(),
                notificationData
        );

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
        int total = schedule.getType().equals("21") ? 21 : 28;
        int currentIndex = schedule.getCurrentIndex();

        for (int i = 0; i < total; i++) {
            LocalDate date = start.plusDays(i);

            boolean taken = i <= currentIndex;

            if (schedule.getType().equals("21") && i >= 21) {
                taken = false;
            }

            history.put(date.toString(), taken);
        }

        return history;
    }

    public ContraceptiveSchedule getScheduleById(Long scheduleId) {
        return contraceptiveScheduleRepository.findById(scheduleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lịch uống thuốc với id " + scheduleId));
    }


}
