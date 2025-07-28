package com.ghsms.model;

import com.ghsms.file_enum.ServiceCategoryType;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "Services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Services {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ServiceID")
    private Long serviceId;

    @NotBlank(message = "Service name cannot be blank")
    @Size(max = 255, message = "Service name must be less than 255 characters")
    @Column(name = "ServiceName", nullable = false, length = 255,columnDefinition = "nvarchar(100)")
    private String serviceName;

    @Enumerated(EnumType.STRING)
    @Column(name = "category_type")
    private ServiceCategoryType categoryType;


    @Column(name = "Category")
    private String category;

    @Column(name = "Description",columnDefinition = "nvarchar(100)")
    private String description;

    @DecimalMin(value = "0.00", message = "Price must be non-negative")
    @Column(name = "Price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "Preparation",columnDefinition = "nvarchar(100)")
    private String preparation;

    @Column(name = "Duration")
    private String duration;

    @Column(name = "IsActive", columnDefinition = "BIT DEFAULT 1")
    private boolean active = true;

    @Column(name = "specialization", columnDefinition = "nvarchar(100)")
    private String specialization;


}