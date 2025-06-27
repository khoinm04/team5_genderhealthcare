package com.ghsms.service;

import com.ghsms.DTO.DailyStatsDTO;
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

        // Bỏ qua user null hoặc không có createdAt
        Map<LocalDate, Long> userCounts = users.stream()
                .filter(Objects::nonNull)
                .filter(u -> u.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        u -> u.getCreatedAt().toLocalDate(),
                        Collectors.counting()
                ));

        // Bỏ qua booking null hoặc không có createdAt
        Map<LocalDate, Long> bookingCounts = bookings.stream()
                .filter(Objects::nonNull)
                .filter(b -> b.getCreatedAt() != null)
                .collect(Collectors.groupingBy(
                        b -> b.getCreatedAt().toLocalDate(),
                        Collectors.counting()
                ));

        // Gộp tất cả ngày lại
        Set<LocalDate> allDates = new HashSet<>();
        allDates.addAll(userCounts.keySet());
        allDates.addAll(bookingCounts.keySet());

        // In log ngày đang thống kê
        System.out.println("📅 Số ngày thống kê: " + allDates.size());

        // Trả kết quả đã gộp
        return allDates.stream()
                .sorted()
                .map(date -> new DailyStatsDTO(
                        date,
                        userCounts.getOrDefault(date, 0L),
                        bookingCounts.getOrDefault(date, 0L)
                ))
                .collect(Collectors.toList());
    }



}
