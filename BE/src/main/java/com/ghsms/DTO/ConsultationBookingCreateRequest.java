package com.ghsms.DTO;

import lombok.Data;

@Data
public class ConsultationBookingCreateRequest {
    private String customerName;

    private String customerPhone;

    private String customerEmail;
    private String bookingDate;
    private String timeSlot;
    private Long serviceId;
    private Long consultantId;
    private Integer age;
    private String gender;
}

