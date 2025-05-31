package com.GenderHealthCare.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "Services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ServiceID")
    private Long serviceId;

    @NotBlank(message = "Dịch vuc không được để trống")
    @Size(max = 255, message = "Dịch vụ nên ít hơn 255 ký tự")
    @Column(name = "ServiceName", nullable = false, length = 255)
    private String serviceName;

    @Lob // For TEXT type
    @Column(name = "Description")
    private String description;

    @DecimalMin(value = "0.00", inclusive = false , message = "Giá phải lớn hơn 0")
    @Column(name = "Price", precision = 10, scale = 2)
    private BigDecimal price;

    @Builder.Default
    @Column(name = "IsActive", columnDefinition = "BIT DEFAULT 1")
    private boolean isActive = true;
}