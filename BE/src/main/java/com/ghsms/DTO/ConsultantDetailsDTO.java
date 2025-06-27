package com.ghsms.DTO;

import com.ghsms.file_enum.ConsultantSpecialization;
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
    private ConsultantSpecialization specialization;

    public static ConsultantDetailsDTO fromEntity(ConsultantDetails details) {
        return new ConsultantDetailsDTO(
                details.getConsultant().getUserId(),            // Lấy ID từ User
                details.getConsultant().getName(),      // Lấy tên từ User
                details.getSpecialization()                 // Lấy chuyên môn từ chính entity
        );
    }
}

