package com.ghsms.DTO;

import com.ghsms.file_enum.ServiceBookingCategory;
import com.ghsms.file_enum.ServiceCategoryType;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CreateServiceRequest {
    private String serviceName;
    private String description;
    private BigDecimal price; // hoặc BigDecimal nếu dùng số tiền chính xác
    private String duration; // ví dụ: "30 phút", có thể để là String
    private ServiceBookingCategory category; // mã danh mục: "STI_Chlamydia", "GEN_Health"
    private ServiceCategoryType categoryType; // ENUM: TEST, CONSULTATION
    private Boolean isActive;
}
