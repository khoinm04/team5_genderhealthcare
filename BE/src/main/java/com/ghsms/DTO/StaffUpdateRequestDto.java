package com.ghsms.DTO;

import com.ghsms.file_enum.StaffSpecialization;
import lombok.Data;

import java.time.LocalDate;

@Data
public class StaffUpdateRequestDto {
    private Long staffId;

    // ⚙ Thông tin từ bảng User
    private String name;
    private String email;
    private String phoneNumber;

    // ⚙ Thông tin từ bảng StaffDetails
    private StaffSpecialization specialization;
    private LocalDate hireDate;
}

