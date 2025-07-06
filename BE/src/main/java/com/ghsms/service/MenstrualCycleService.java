package com.ghsms.service;

import com.ghsms.DTO.MenstrualCycleDTO;
import com.ghsms.DTO.NotificationDTO;
import com.ghsms.model.MenstrualCycle;
import com.ghsms.model.Notification;
import com.ghsms.model.User;
import com.ghsms.repository.MenstrualCycleRepository;
import com.ghsms.repository.NotificationRepository;
import com.ghsms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MenstrualCycleService {
    private final MenstrualCycleRepository menstrualCycleRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;


    // Thêm thông tin theo dõi chu kỳ kinh nguyệt
    public MenstrualCycle trackCycle(Long customerId, LocalDate startDate, Integer cycleLength, Integer menstruationDuration, String notes) {
        try {
            System.out.println("📌 trackCycle START");
            System.out.println("customerId: " + customerId);
            System.out.println("startDate: " + startDate);
            System.out.println("cycleLength: " + cycleLength);
            System.out.println("menstruationDuration: " + menstruationDuration);

            LocalDate currentDate = LocalDate.now();

            MenstrualCycle cycle = new MenstrualCycle();

            // Gán customer
            User user = userRepository.findById(customerId)
                    .orElseThrow(() -> new RuntimeException("❌ Không tìm thấy người dùng với ID: " + customerId));
            cycle.setCustomer(user);

            // Kiểm tra đã có chu kỳ chưa
            menstrualCycleRepository.findByCustomer_userId(customerId)
                    .ifPresent(existingCycle -> {
                        throw new RuntimeException("❌ Người dùng đã có chu kỳ được theo dõi.");
                    });

            // Kiểm tra ngày bắt đầu
            int validCycleLength = (cycleLength != null) ? cycleLength : 28;
            LocalDate minDate = currentDate.minusDays(validCycleLength);

            if (startDate.isBefore(minDate)) {
                throw new RuntimeException("❌ Ngày bắt đầu không được cách quá " + validCycleLength + " ngày.");
            }

            if (startDate.isAfter(currentDate)) {
                throw new RuntimeException("❌ Ngày bắt đầu không được sau ngày hiện tại.");
            }

            cycle.setStartDate(startDate);

            // Kiểm tra cycle length
            if (cycleLength != null) {
                if (cycleLength < 20 || cycleLength > 45) {
                    throw new RuntimeException("❌ Số ngày giữa chu kỳ phải từ 20-45 ngày.");
                }
                cycle.setCycleLength(cycleLength);
            } else {
                cycle.setCycleLength(28);
            }

            // Kiểm tra menstruationDuration
            if (menstruationDuration != null) {
                if (menstruationDuration < 1 || menstruationDuration > 10) {
                    throw new RuntimeException("❌ Số ngày hành kinh phải từ 1-10 ngày.");
                }
                cycle.setMenstruationDuration(menstruationDuration);
            } else {
                cycle.setMenstruationDuration(5);
            }

            cycle.setNotes(notes);

            // Tính toán dự đoán
            calculatePredictions(cycle);

            System.out.println("✅ Trước khi save:");
            System.out.println("UserID: " + user.getUserId());
            System.out.println("StartDate: " + cycle.getStartDate());
            System.out.println("Length: " + cycle.getCycleLength());
            System.out.println("Menstruation: " + cycle.getMenstruationDuration());

            return menstrualCycleRepository.save(cycle);
        } catch (Exception e) {
            System.err.println("💥 Lỗi khi xử lý trackCycle:");
            e.printStackTrace(); // In đầy đủ stacktrace ra console
            throw e; // Cho phép Spring trả lỗi 500 về client để debug
        }
    }


    private void calculatePredictions(MenstrualCycle cycle) {
        // end period date
        cycle.setEndDate(cycle.getStartDate().plusDays(cycle.getCycleLength() - 1));

        //set ovulation prediction (typically 14 days before next period)
        cycle.setPredictedOvulationDate(cycle.getStartDate().plusDays(cycle.getCycleLength() - 14));

        //set predicted fertile window start date
        cycle.setPredictedFertileWindowStartDate(cycle.getStartDate().plusDays(cycle.getCycleLength() - 17));

        //set predicted fertile window end date
        cycle.setPredictedFertileWindowEndDate((cycle.getPredictedOvulationDate()));

        // Next period prediction
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
        return menstrualCycleRepository.findByCustomer_userId(customerId).
                orElseThrow(() -> new RuntimeException("Vui lòng nhập chu kỳ kinh nguyệt của bạn trước khi thực hiện chức năng này"));
    }

    public void deleteMenstrualCycle(Long customerId, Long cycleId) {
        MenstrualCycle cycle = menstrualCycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chu kỳ kinh nguyệt này"));

        // Verify the cycle belongs to the customer
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

        // Verify ownership
        if (!cycle.getCustomer().getUserId().equals(customerId)) {
            throw new RuntimeException("Không có quyền cập nhật chu kỳ kinh nguyệt này");
        }

        int validCycleLength = cycleLength != null ? cycleLength : 28;

        LocalDate minDate = currentDate.minusDays(validCycleLength);

        if(startDate.isBefore(minDate)){
            throw new RuntimeException("Ngày bắt đầu không được cách quá " + validCycleLength + " ngày so với hiện tại");
        }

        if (startDate.isAfter(currentDate)) {
            throw new RuntimeException("Ngày bắt đầu không được sau ngày hiện tại");
        }
        // Update start date
        cycle.setStartDate(startDate);

        // Validate and update cycle length
        if (cycleLength != null) {
            if (cycleLength < 20 || cycleLength > 45) {
                throw new RuntimeException("Số ngày giữa 2 chu kỳ phải từ 20 đến 45 ngày, nếu không bạn nên đi kiểm tra sức khỏe");
            }
            cycle.setCycleLength(cycleLength);
        }

        // Validate and update menstruation duration
        if (menstruationDuration != null) {
            if (menstruationDuration < 1 || menstruationDuration > 10) {
                throw new RuntimeException("Số ngày hành kinh phải từ 1 đến 10 ngày, nếu không bạn nên đi kiểm tra sức khỏe");
            }
            cycle.setMenstruationDuration(menstruationDuration);
        }

        // Validate and update notes
        if (notes != null && notes.length() > 255) {
            throw new RuntimeException("Chú thích nên ít hơn 255 ký tự");
        }
        if (notes != null) {
            cycle.setNotes(notes);
        }

        // Recalculate predictions
        calculatePredictions(cycle);

        return menstrualCycleRepository.save(cycle);
    }

    // Scheduled task to send notifications for upcoming menstrual cycle events

    @Scheduled(cron = "0 0 8 * * *", zone = "Asia/Ho_Chi_Minh") // Run at 8 AM daily
    public void sendReminders() {
        LocalDate today = LocalDate.now();

        // Nhắc nhở chu kỳ kinh nguyệt
        sendMenstrualCycleReminders(today);
    }

    private void sendMenstrualCycleReminders(LocalDate today) {
        // 1. Nhắc nhở ngày sắp đến chu kỳ kinh nguyệt
        List<MenstrualCycle> upcomingCyclesBefore2Day = menstrualCycleRepository.findByNextPredictedDateEquals(today.plusDays(2));
        for (MenstrualCycle cycle : upcomingCyclesBefore2Day) {
            createNotification(cycle, "Chu kỳ kinh nguyệt của bạn dự kiến sẽ bắt đầu trong 2 ngày tới.");
        }

        List<MenstrualCycle> upcomingCyclesBefore1Day = menstrualCycleRepository.findByNextPredictedDateEquals(today.plusDays(1));
        for (MenstrualCycle cycle : upcomingCyclesBefore1Day) {
            createNotification(cycle, "Chu kỳ kinh nguyệt của bạn dự kiến sẽ bắt đầu vào ngày mai.");
        }

        // 2. Nhắc nhở ngày rụng trứng
        List<MenstrualCycle> ovulationCycles = menstrualCycleRepository.findByPredictedOvulationDateEquals(today);
        for (MenstrualCycle cycle : ovulationCycles) {
            createNotification(cycle, "Hôm nay là ngày rụng trứng dự kiến. Nếu bạn có kế hoạch mang thai hoặc phòng tránh thai, hãy lưu ý nhé!");
        }

        // 3. Nhắc nhở bắt đầu cửa sổ thụ thai
        List<MenstrualCycle> fertileWindowStartCycles = menstrualCycleRepository.findByPredictedFertileWindowStartDateEquals(today);
        for (MenstrualCycle cycle : fertileWindowStartCycles) {
            createNotification(cycle, "Hôm nay là ngày bắt đầu bắt đầu chuỗi ngày có khả năng thụ thai cao.");
        }

        // 4. Nhắc nhở kết thúc cửa sổ thụ thai
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


//    public void createNotification(MenstrualCycle cycle, String message) {
//        Notification notification = new Notification();
//        notification.setUser(cycle.getCustomer());
//        notification.setMessage(message);
//        notification.setCreatedAt(LocalDateTime.now());
//        notificationRepository.save(notification);
//    }

    public void createNotification(MenstrualCycle cycle, String message) {
        // 1. Lưu database
        Notification notification = new Notification();
        notification.setUser(cycle.getCustomer());
        notification.setMessage(message);
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);

        // 2. Gửi WebSocket
        messagingTemplate.convertAndSend(
                "/topic/user/" + cycle.getCustomer().getUserId(),
                message
        );

        System.out.println("✅ Đã gửi thông báo chu kỳ cho user: " + cycle.getCustomer().getUserId());
    }
}