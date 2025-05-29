package com.ghsms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "Services")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Service {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ServiceID")
    private Long serviceId;

    @NotBlank(message = "Service name cannot be blank")
    @Size(max = 255, message = "Service name must be less than 255 characters")
    @Column(name = "ServiceName", nullable = false, length = 255)
    private String serviceName;

    @Lob // For TEXT type
    @Column(name = "Description")
    private String description;

    @DecimalMin(value = "0.00", message = "Price must be non-negative")
    @Column(name = "Price", precision = 10, scale = 2)
    private BigDecimal price;

    @Column(name = "IsActive", columnDefinition = "BIT DEFAULT 1")
    private boolean isActive = true;
}
