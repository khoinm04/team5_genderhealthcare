package com.ghsms.service;

import com.ghsms.model.MenstrualCycle;
import com.ghsms.model.Notification;
import com.ghsms.repository.MenstrualCycleRepository;
import com.ghsms.repository.NotificationRepository;
import com.ghsms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class MenstrualCycleService {
    private final MenstrualCycleRepository cycleRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;


    // Thêm thông tin theo dõi chu kỳ kinh nguyệt
    public MenstrualCycle trackCycle(Long customerId, LocalDate startDate, Integer cycleLength, Integer menstruationDuration, String notes) {

        MenstrualCycle cycle = new MenstrualCycle();
        cycle.setCustomer(userRepository.findById(customerId).orElseThrow(() -> new RuntimeException("Không tìm thấy dữ liêu người dùng với ID")));

        // Check if customer already has a cycle
        cycleRepository.findByCustomerUserId(customerId)
                .ifPresent(existingCycle -> {
                    throw new RuntimeException("Người dùng đã có chu kỳ được theo dõi, vui lòng xóa hoặc cập nhật chu kỳ hiện tại.");
                });

        cycle.setStartDate(startDate);
        // kiểm tra độ dài của chu kỳ kinh nguyệt và số ngày hành kinh

        if(cycleLength != null){
            if (cycleLength < 20 || cycleLength > 45) {
                throw new RuntimeException("Số ngày giữa 2 chu kỳ phải từ 20 đến 45 ngày, nếu không bạn nên đi kiểm tra sức khỏe ");
            }else{
                cycle.setCycleLength(cycleLength);
            }
        } else {
            cycle.setCycleLength(28);
        }

        if(menstruationDuration != null){
            if (menstruationDuration < 1 || menstruationDuration > 10) {
                throw new RuntimeException("Số ngày hành kinh phải từ 1 đến 10 ngày, nếu không bạn nên đi kiểm tra sức khỏe ");
            }else{
                cycle.setMenstruationDuration(menstruationDuration);
            }
        } else {
            cycle.setMenstruationDuration(5); // default value;
        }

        cycle.setNotes(notes);

        // Calculate predictions
        calculatePredictions(cycle);
        return cycleRepository.save(cycle);
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

    @Scheduled(cron = "0 0 8 * * *") // Run at 8 AM daily
    public void sendReminders() {
        LocalDate today = LocalDate.now();
        List<MenstrualCycle> upcomingCycles = cycleRepository
                .findByNextPredictedDateEquals(today.plusDays(2));

        for (MenstrualCycle cycle : upcomingCycles) {
            createNotification(cycle);
        }
    }

    private void createNotification(MenstrualCycle cycle) {
        Notification notification = new Notification();
        notification.setUser(cycle.getCustomer());
        notification.setMessage("Chu kỳ kinh nguyệt của bạn dự kiến sẽ bắt đầu trong 2 ngày tới.");
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
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
        return cycleRepository.findByCustomerUserId(customerId).
                orElseThrow(() -> new RuntimeException("Vui lòng nhập chu kỳ kinh nguyệt của bạn trước khi thực hiện chức năng này"));
    }

    public void deleteMenstrualCycle(Long customerId, Long cycleId) {
        MenstrualCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chu kỳ kinh nguyệt này"));

        // Verify the cycle belongs to the customer
        if (!cycle.getCustomer().getUserId().equals(customerId)) {
            throw new RuntimeException("Không có quyền xóa chu kỳ kinh nguyệt này");
        }

        cycleRepository.delete(cycle);
    }

    public MenstrualCycle getAllPredicted(Long customerId) {
        Optional<MenstrualCycle> cycles = cycleRepository
                .findByCustomerUserId(customerId);
        if (cycles.isEmpty()) {
            throw new RuntimeException("Không tìm thấy chu kỳ kinh nguyệt của bạn: " + customerId);
        }
        return cycles.get();
    }

    public MenstrualCycle updateCycle(Long customerId, Long cycleId, LocalDate startDate,
                                      Integer cycleLength, Integer menstruationDuration, String notes) {

        MenstrualCycle cycle = cycleRepository.findById(cycleId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy chu kỳ kinh nguyệt của khách hàng"));

        // Verify ownership
        if (!cycle.getCustomer().getUserId().equals(customerId)) {
            throw new RuntimeException("Không có quyền cập nhật chu kỳ kinh nguyệt này");
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

        return cycleRepository.save(cycle);
    }
}