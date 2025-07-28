package com.ghsms.DTO;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ServiceUpdateDTO {
    private String serviceName;
    private String description;
    private BigDecimal price;
    private String duration;
    private String category;
    private Boolean isActive;
}

