package com.ghsms.DTO;

// CertificateDto.java
import lombok.Data;

@Data
public class CertificateDTO {
    private Long id;    // Có thể null nếu chứng chỉ mới
    private String name;

    public CertificateDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}

