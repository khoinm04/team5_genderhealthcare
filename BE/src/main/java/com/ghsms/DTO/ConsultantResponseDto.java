package com.ghsms.DTO;

import com.ghsms.model.Certificate;
import com.ghsms.model.ConsultantDetails;
import com.ghsms.model.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultantResponseDto {
    private Long id;
    private String fullName;
    private String email;
    private String roleDisplay;
    private String specialization;
    private LocalDate hireDate;
    private Integer yearsOfExperience;
    private Boolean active;
    private String phoneNumber;
    private List<String> certificates;


    public static ConsultantResponseDto from(User user, ConsultantDetails details) {
        List<String> certNames = details != null && details.getCertificates() != null
                ? details.getCertificates().stream()
                .map(Certificate::getName)
                .filter(name -> name != null && !name.isBlank())
                .toList()
                : List.of();



        return ConsultantResponseDto.builder()
                .id(user.getUserId())
                .fullName(user.getName())
                .email(user.getEmail())
                .roleDisplay("Tư vấn viên")
                .specialization(details != null ? details.getSpecialization() : null)
                .hireDate(details != null ? details.getHireDate() : null)
                .yearsOfExperience(details != null ? details.getYearsOfExperience() : null)
                .active(user.getIsActive())
                .phoneNumber(user.getPhoneNumber())
                .certificates(certNames)
                .build();
    }
}

