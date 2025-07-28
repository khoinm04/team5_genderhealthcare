package com.ghsms.DTO;

import com.ghsms.model.StaffDetails;
import com.ghsms.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StaffResponseDto {
    private Long id;
    private String fullName;
    private String email;
    private String roleDisplay;
    private String specialization;
    private LocalDate hireDate;
    private Boolean active;
    private String phoneNumber;

    public static StaffResponseDto from(User user, StaffDetails details) {
        return StaffResponseDto.builder()
                .id(user.getUserId())
                .fullName(user.getName())
                .email(user.getEmail())
                .roleDisplay("Nhân viên")
                .specialization(details != null ? details.getSpecialization() : null)
                .hireDate(details != null ? details.getHireDate() : null)
                .active(user.getIsActive())
                .phoneNumber(user.getPhoneNumber())
                .build();
    }
}
