package com.ghsms.DTO;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PillHistoryDTO {
    private Map<String, Boolean> history;
    private long totalMissedDays;
}

