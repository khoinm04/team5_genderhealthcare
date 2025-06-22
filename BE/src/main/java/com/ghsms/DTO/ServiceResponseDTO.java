package com.ghsms.DTO;

import com.ghsms.file_enum.ServiceBookingCategory;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class ServiceResponseDTO {
    private Long serviceId;
    private String serviceName;
    private ServiceBookingCategory category;
    private String description;
    private BigDecimal price;
    private String duration;
    private Boolean isActive;
}
