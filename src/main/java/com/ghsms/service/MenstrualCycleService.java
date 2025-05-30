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

@Service
@RequiredArgsConstructor
public class MenstrualCycleService {
    private final MenstrualCycleRepository cycleRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public MenstrualCycle trackCycle(Long customerId, LocalDate startDate, LocalDate endDate, String notes) {
        List<MenstrualCycle> previousCycles = cycleRepository
            .findByCustomerUserIdOrderByStartDateDesc(customerId);

        MenstrualCycle cycle = new MenstrualCycle();
        cycle.setCustomer(userRepository.findById(customerId).orElseThrow());
        cycle.setStartDate(startDate);
        cycle.setEndDate(endDate);
        cycle.setNotes(notes);

        // Calculate cycle length based on previous cycles
        if (!previousCycles.isEmpty()) {
            MenstrualCycle lastCycle = previousCycles.get(0);
            cycle.setCycleLength((int) lastCycle.getStartDate().until(startDate).getDays());
        } else {
            cycle.setCycleLength(28); // Default cycle length
        }

        // Calculate predictions
        calculatePredictions(cycle);
        return cycleRepository.save(cycle);
    }

    private void calculatePredictions(MenstrualCycle cycle) {
        // Next period prediction
        cycle.setNextPredictedDate(cycle.getStartDate().plusDays(cycle.getCycleLength()));

        // Ovulation prediction (typically 14 days before next period)
        cycle.setOvulationDate(cycle.getNextPredictedDate().minusDays(14));
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
        notification.setMessage("Your next period is predicted to start in 2 days");
        notification.setCreatedAt(LocalDateTime.now());
        notificationRepository.save(notification);
    }

    public List<MenstrualCycle> getCycleHistory(Long customerId) {
        return cycleRepository.findByCustomerUserIdOrderByStartDateDesc(customerId);
    }

    public LocalDate getPredictedNextDate(Long customerId) {
        MenstrualCycle currentCycle = getCurrentCycle(customerId);
        return currentCycle != null ? currentCycle.getNextPredictedDate() : null;
    }

    public LocalDate getOvulationDate(Long customerId) {
        MenstrualCycle currentCycle = getCurrentCycle(customerId);
        return currentCycle != null ? currentCycle.getOvulationDate() : null;
    }

    public MenstrualCycle getCurrentCycle(Long customerId) {
        List<MenstrualCycle> cycles = cycleRepository
                .findByCustomerUserIdOrderByStartDateDesc(customerId);
        if (cycles.isEmpty()) {
            throw new RuntimeException("No cycles found for customer: " + customerId);
        }
        return cycles.get(0);
    }
}