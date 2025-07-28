package com.ghsms.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationStatsDTO {

    private int totalSessions;
    private long totalMinutes;
    private double averageMinutes;


}

