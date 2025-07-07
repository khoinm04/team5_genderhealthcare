package com.ghsms.DTO;

import lombok.Data;

@Data
public class ConsultationBookingCreateRequest {
    private String customerName;

    private String customerPhone;

    private String customerEmail;
    private String bookingDate; // dạng "yyyy-MM-dd"
    private String timeSlot;    // dạng "HH:mm-HH:mm"
    private Long serviceId;
    private Long consultantId; // có thể null
    private Integer age;
    private String gender;
}

