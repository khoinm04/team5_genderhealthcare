package com.ghsms.DTO;

import com.ghsms.file_enum.ConsultantSpecialization;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ConsultantUpdateRequestDto {
    private Long consultantId;
    private String name;
    private String email;
    private String phoneNumber;
    private ConsultantSpecialization specialization;
    private LocalDate hireDate;
    private Integer yearsOfExperience;
}
