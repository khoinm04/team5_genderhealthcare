package com.ghsms.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;

@Data
@AllArgsConstructor
public class DailyStatsDTO {
    private LocalDate date;
    private long totalUsers;
    private long bookingConsultant;
    private long bookingTest;
}
