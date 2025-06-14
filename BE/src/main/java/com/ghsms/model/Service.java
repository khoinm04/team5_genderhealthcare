package com.ghsms.model;

    import com.ghsms.file_enum.ServiceBookingCategory;
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
    public class Service {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "ServiceID")
        private Long serviceId;

        @NotBlank(message = "Service name cannot be blank")
        @Size(max = 255, message = "Service name must be less than 255 characters")
        @Column(name = "ServiceName", nullable = false, length = 255)
        private String serviceName;

        @Enumerated(EnumType.STRING)
        @Column(name = "Category", nullable = false)
        private ServiceBookingCategory category;

        @Lob
        @Column(name = "Description")
        private String description;

        @DecimalMin(value = "0.00", message = "Price must be non-negative")
        @Column(name = "Price", precision = 10, scale = 2)
        private BigDecimal price;

        @Column(name = "Preparation")
        private String preparation; // e.g., "Không cần nhịn ăn"

        @Column(name = "Duration")
        private String duration; // e.g., "30 phút"

        @Column(name = "IsActive", columnDefinition = "BIT DEFAULT 1")
        private boolean isActive = true;
    }