package com.ghsms.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class ConsultantUpdateRequestDto {
    private Long consultantId;
    private String name;
    private String email;
    private String phoneNumber;
    private String specialization;
    private LocalDate hireDate;
    private Integer yearsOfExperience;
}
