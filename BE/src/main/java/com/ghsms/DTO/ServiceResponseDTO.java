package com.ghsms.DTO;

import com.ghsms.file_enum.ServiceBookingCategory;
import com.ghsms.file_enum.ServiceCategoryType;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceResponseDTO {
    private Long serviceId;
    private String serviceName;
    private ServiceBookingCategory category;
    private ServiceCategoryType categoryType;
    private String description;
    private BigDecimal price;
    private String duration;
    private Boolean isActive;
}
