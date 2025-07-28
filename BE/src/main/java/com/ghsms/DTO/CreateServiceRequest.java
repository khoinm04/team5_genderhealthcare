package com.ghsms.DTO;

import com.ghsms.file_enum.ServiceCategoryType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateServiceRequest {
    private String serviceName;
    private String description;
    private BigDecimal price;
    private String duration;
    private String category;
    private ServiceCategoryType categoryType;
    private Boolean isActive;
}
