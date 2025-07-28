package com.ghsms.service;

import com.ghsms.DTO.MenstrualCycleDTO;
import com.ghsms.model.MenstrualCycle;
import com.ghsms.model.Notification;
import com.ghsms.model.User;
import com.ghsms.repository.MenstrualCycleRepository;
import com.ghsms.repository.NotificationRepository;
import com.ghsms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class MenstrualCycleService {
    private final MenstrualCycleRepository menstrualCycleRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    private static final Logger logger = LoggerFactory.getLogger(MenstrualCycleService.class);



    public MenstrualCycle trackCycle(Long customerId, LocalDate startDate, Integer cycleLength, Integer menstruationDuration, String notes) {
        try {

            LocalDate currentDate = LocalDate.now();

            MenstrualCycle cycle = new MenstrualCycle();

            User user = userRepository.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với ID: " + customerId));
            cycle.setCustomer(user);

            menstrualCycleRepository.findByCustomer_userId(customerId)
                    .ifPresent(menstrualCycleRepository::delete);


            if (startDate.isAfter(currentDate)) {
                String message = "Ngày bắt đầu không được sau ngày hiện tại.";
                createNotificationWebSocket(cycle, message);
                throw new RuntimeException("Ngày bắt đầu không được sau ngày hiện tại.");
            }

            cycle.setStartDate(startDate);

            if (cycleLength != null) {
                if (cycleLength < 25 || cycleLength > 45) {
                    String message = "Số ngày giữa chu kỳ phải từ 20-45 ngày, nếu không bạn nên đi kiểm tra sức khỏe.";
                    createNotificationWebSocket(cycle, message);
                    throw new RuntimeException("Số ngày giữa chu kỳ phải từ 20-45 ngày.");
                }
                cycle.setCycleLength(cycleLength);
            } else {
                cycle.setCycleLength(28);
            }

            if (menstruationDuration != null) {
                if (menstruationDuration < 1 || menstruationDuration > 10) {
                    String message = "Số ngày hành kinh phải từ 1-10 ngày, nếu không bạn nên đi kiểm tra sức khỏe.";
                    createNotificationWebSocket(cycle, message);
                    throw new RuntimeException("Số ngày hành kinh phải từ 1-10 ngày.");
                }
                cycle.setMenstruationDuration(menstruationDuration);
            } else {
                cycle.setMenstruationDuration(5);
            }

            cycle.setNotes(notes);

            calculatePredictions(cycle);

            return menstrualCycleRepository.save(cycle);
        } catch (Exception e) {
            logger.error("Lỗi khi xử lý chu ky ", e);
            throw e;

        }
    }


    private void calculatePredictions(MenstrualCycle cycle) {
        cycle.setEndDate(cycle.getStartDate().plusDays(cycle.getCycleLength() - 1));

        cycle.setPredictedOvulationDate(cycle.getStartDate().plusDays(cycle.getCycleLength() - 14));

        cycle.setPredictedFertileWindowStartDate(cycle.getStartDate().plusDays(cycle.getCycleLength() - 17));

        cycle.setPredictedFertileWindowEndDate((cycle.getPredictedOvulationDate().plusDays(1)));

        cycle.setNextPredictedDate(cycle.getStartDate().plusDays(cycle.getCycleLength()));
    }


    public LocalDate getPredictedNextDate(Long customerId) {
        MenstrualCycle currentCycle = getCurrentCycle(customerId);
        return currentCycle != null ? currentCycle.getNextPredictedDate() : null;
    }

    public LocalDate getOvulationDate(Long customerId) {
        MenstrualCycle currentCycle = getCurrentCycle(customerId);
        return currentCycle != null ? currentCycle.getPredictedOvulationDate() : null;
    }

    public MenstrualCycle getCurrentCycle(Long customerId) {
        return menstrualCycleRepository.findByCustomer_userId(customerId).orElse(null);
    }


    public void deleteMenstrualCycle(Long customerId, Long cycleId) {
        MenstrualCycle cycle = menstrualCycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chu kỳ kinh nguyệt này"));


        if (!cycle.getCustomer().getUserId().equals(customerId)) {
            throw new RuntimeException("Không có quyền xóa chu kỳ kinh nguyệt này");
        }

        menstrualCycleRepository.delete(cycle);
    }

    public MenstrualCycle getAllPredicted(Long customerId) {
        Optional<MenstrualCycle> cycles = menstrualCycleRepository
                .findByCustomer_userId(customerId);
        if (cycles.isEmpty()) {
            throw new RuntimeException("Không tìm thấy chu kỳ kinh nguyệt của bạn: " + customerId);
        }
        return cycles.get();
    }

    public MenstrualCycle updateCycle(Long customerId, Long cycleId, LocalDate startDate,
                                      Integer cycleLength, Integer menstruationDuration, String notes) {
        LocalDate currentDate = LocalDate.now();

        MenstrualCycle cycle = menstrualCycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chu kỳ kinh nguyệt của khách hàng"));

        if (!cycle.getCustomer().getUserId().equals(customerId)) {
            throw new RuntimeException("Không có quyền cập nhật chu kỳ kinh nguyệt này");
        }


        if (startDate.isAfter(currentDate)) {
            String message = "Ngày bắt đầu không được sau ngày hiện tại";
            createNotificationWebSocket(cycle, message);
            throw new RuntimeException("Ngày bắt đầu không được sau ngày hiện tại");
        }
        cycle.setStartDate(startDate);

        if (cycleLength != null) {
            if (cycleLength < 25 || cycleLength > 45) {
                String message = "Số ngày giữa 2 chu kỳ phải từ 20 đến 45 ngày, nếu không bạn nên đi kiểm tra sức khỏe";
                createNotificationWebSocket(cycle, message);
                throw new RuntimeException("Số ngày giữa 2 chu kỳ phải từ 20 đến 45 ngày, nếu không bạn nên đi kiểm tra sức khỏe");
            }
            cycle.setCycleLength(cycleLength);
        }

        if (menstruationDuration != null) {
            if (menstruationDuration < 1 || menstruationDuration > 10) {
                String message = "Số ngày hành kinh phải từ 1 đến 10 ngày, nếu không bạn nên đi kiểm tra sức khỏe";
                createNotificationWebSocket(cycle, message);
                throw new RuntimeException("Số ngày hành kinh phải từ 1 đến 10 ngày, nếu không bạn nên đi kiểm tra sức khỏe");
            }
            cycle.setMenstruationDuration(menstruationDuration);
        }

        if (notes != null && notes.length() > 255) {
            String message = "Chú thích nên ít hơn 255 ký tự";
            createNotificationWebSocket(cycle, message);
            throw new RuntimeException("Chú thích nên ít hơn 255 ký tự");
        }
        if (notes != null) {
            cycle.setNotes(notes);
        }

        calculatePredictions(cycle);

        return menstrualCycleRepository.save(cycle);
    }


    @Scheduled(cron = "0 00 8 * * *", zone = "Asia/Ho_Chi_Minh")
    public void sendReminders() {
        LocalDate today = LocalDate.now();

        sendMenstrualCycleReminders(today);
    }

    private void sendMenstrualCycleReminders(LocalDate today) {
        List<MenstrualCycle> upcomingCyclesBefore2Day = menstrualCycleRepository.findByNextPredictedDateEquals(today.plusDays(2));
        for (MenstrualCycle cycle : upcomingCyclesBefore2Day) {
            createNotification(cycle, "Chu kỳ kinh nguyệt của bạn dự kiến sẽ bắt đầu trong 2 ngày tới.");
        }

        List<MenstrualCycle> upcomingCyclesBefore1Day = menstrualCycleRepository.findByNextPredictedDateEquals(today.plusDays(1));
        for (MenstrualCycle cycle : upcomingCyclesBefore1Day) {
            createNotification(cycle, "Chu kỳ kinh nguyệt của bạn dự kiến sẽ bắt đầu vào ngày mai.");
        }

        List<MenstrualCycle> ovulationCycles = menstrualCycleRepository.findByPredictedOvulationDateEquals(today);
        for (MenstrualCycle cycle : ovulationCycles) {
            createNotification(cycle, "Hôm nay là ngày rụng trứng dự kiến. Nếu bạn có kế hoạch mang thai hoặc phòng tránh thai, hãy lưu ý nhé!");
        }

        List<MenstrualCycle> fertileWindowStartCycles = menstrualCycleRepository.findByPredictedFertileWindowStartDateEquals(today);
        for (MenstrualCycle cycle : fertileWindowStartCycles) {
            createNotification(cycle, "Hôm nay là ngày bắt đầu bắt đầu chuỗi ngày có khả năng thụ thai cao.");
        }

        List<MenstrualCycle> fertileWindowEndCycles = menstrualCycleRepository.findByPredictedFertileWindowEndDateEquals(today);
        for (MenstrualCycle cycle : fertileWindowEndCycles) {
            createNotification(cycle, "Hôm nay là ngày kết thúc chuỗi ngày có khả năng thụ thai cao.");
        }
    }


    public MenstrualCycleDTO toDTO(MenstrualCycle cycle) {
        if (cycle == null) return null;

        return MenstrualCycleDTO.builder()
                .cycleId(cycle.getCycleId())
                .userId(cycle.getCustomer().getUserId())
                .startDate(cycle.getStartDate())
                .endDate(cycle.getEndDate())
                .cycleLength(cycle.getCycleLength())
                .menstruationDuration(cycle.getMenstruationDuration())
                .nextPredictedDate(cycle.getNextPredictedDate())
                .predictedOvulationDate(cycle.getPredictedOvulationDate())
                .predictedFertileWindowStartDate(cycle.getPredictedFertileWindowStartDate())
                .predictedFertileWindowEndDate(cycle.getPredictedFertileWindowEndDate())
                .notes(cycle.getNotes())
                .build();
    }



    public void createNotification(MenstrualCycle cycle, String message) {
        Notification notification = new Notification();
        notification.setUser(cycle.getCustomer());
        notification.setMessage(message);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);

        Map<String, Object> notificationData = Map.of(
                "type", "REMINDER",
                "message", message,
                "timestamp", LocalDateTime.now().toString(),
                "userId", cycle.getCustomer().getUserId()
        );

        messagingTemplate.convertAndSend(
                "/topic/user/" + cycle.getCustomer().getUserId(),
                notificationData
        );


    }

    public void createNotificationWebSocket(MenstrualCycle cycle, String message) {

        Map<String, Object> notificationData = Map.of(
                "type", "REMINDER",
                "message", message,
                "timestamp", LocalDateTime.now().toString(),
                "userId", cycle.getCustomer().getUserId()
        );

        messagingTemplate.convertAndSend(
                "/topic/user/" + cycle.getCustomer().getUserId(),
                notificationData
        );

    }
}