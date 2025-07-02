package com.ghsms.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DailyStatsDTO {
    private LocalDate date;
    private long totalUsers;             // Tài khoản mới
    private long bookingConsultant;      // Số booking tư vấn
    private long bookingTest;            // Số booking xét nghiệm
}
