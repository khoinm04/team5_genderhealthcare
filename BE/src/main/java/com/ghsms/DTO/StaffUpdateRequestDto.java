package com.ghsms.DTO;

import lombok.Data;

import java.time.LocalDate;

@Data
public class StaffUpdateRequestDto {
    private Long staffId;

    private String name;
    private String email;
    private String phoneNumber;


    private String specialization;
    private LocalDate hireDate;
}

