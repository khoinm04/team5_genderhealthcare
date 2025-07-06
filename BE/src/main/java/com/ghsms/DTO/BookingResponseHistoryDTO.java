package com.ghsms.DTO;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class BookingResponseHistoryDTO {
    private Long id;
    private String categoryType;
    private String serviceName;
    private String date;
    private String timeSlot;
    private String assignedStaff;
    private String status;
    private BigDecimal price;
    private String notes;
}
