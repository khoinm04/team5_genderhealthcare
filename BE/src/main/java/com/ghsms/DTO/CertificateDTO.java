package com.ghsms.DTO;


import lombok.Data;

@Data
public class CertificateDTO {
    private Long id;
    private String name;

    public CertificateDTO(Long id, String name) {
        this.id = id;
        this.name = name;
    }
}

