package com.ghsms.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultationDetailsResponse {
    private Long consultationId;
    private String customerName;
    private String email;
    private String phoneNumber;
    private String gender;

    private String consultantName;
    private String specialization;

    private String date;
    private String timeSlot;
    private String note;

    private String feedback;
    private Integer rating;
}

