package com.ghsms.service;

import com.ghsms.DTO.DailyStatsDTO;
import com.ghsms.file_enum.ServiceCategoryType;
import com.ghsms.model.User;
import com.ghsms.model.Booking;
import com.ghsms.repository.UserRepository;
import com.ghsms.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminStatsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookingRepository bookingRepository;

    public List<DailyStatsDTO> getDailyStats() {
        List<User> users = userRepository.findAll();
        List<Booking> bookings = bookingRepository.findAll();

        System.out.println("🔍 Tổng số user: " + users.size());
        System.out.println("🔍 Tổng số booking: " + bookings.size());

        // Đếm user theo ngày
        Map<LocalDate, Long> userCounts = users.stream()
                .filter(Objects::nonNull)
                .filter(u -> u.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        u -> u.getCreatedAt().toLocalDate(),
                        Collectors.counting()
                ));

        // Đếm số booking theo loại dịch vụ
        Map<LocalDate, Long> consultantCounts = new HashMap<>();
        Map<LocalDate, Long> testCounts = new HashMap<>();

        for (Booking b : bookings) {
            if (b == null || b.getCreatedAt() == null || b.getServices() == null) continue;

            LocalDate date = b.getCreatedAt().toLocalDate();

            boolean hasConsultant = b.getServices().stream()
                    .anyMatch(s -> s.getCategoryType() == ServiceCategoryType.CONSULTATION);

            boolean hasTest = b.getServices().stream()
                    .anyMatch(s -> s.getCategoryType() == ServiceCategoryType.TEST);


            if (hasConsultant) {
                consultantCounts.put(date, consultantCounts.getOrDefault(date, 0L) + 1);
            }
            if (hasTest) {
                testCounts.put(date, testCounts.getOrDefault(date, 0L) + 1);
            }
        }

        // Gộp tất cả ngày lại
        Set<LocalDate> allDates = new HashSet<>();
        allDates.addAll(userCounts.keySet());
        allDates.addAll(consultantCounts.keySet());
        allDates.addAll(testCounts.keySet());

        System.out.println("📅 Số ngày thống kê: " + allDates.size());

        // Tạo kết quả DTO
        return allDates.stream()
                .sorted()
                .map(date -> new DailyStatsDTO(
                        date,
                        userCounts.getOrDefault(date, 0L),
                        consultantCounts.getOrDefault(date, 0L),
                        testCounts.getOrDefault(date, 0L)
                ))
                .collect(Collectors.toList());
    }

}
