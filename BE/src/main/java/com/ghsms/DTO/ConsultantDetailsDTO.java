package com.ghsms.DTO;

import com.ghsms.model.ConsultantDetails;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ConsultantDetailsDTO {
    private Long id;
    private String fullName;
    private String specialization;

    public static ConsultantDetailsDTO fromEntity(ConsultantDetails details) {
        return new ConsultantDetailsDTO(
                details.getConsultant().getUserId(),
                details.getConsultant().getName(),
                details.getSpecialization()
        );
    }
}

