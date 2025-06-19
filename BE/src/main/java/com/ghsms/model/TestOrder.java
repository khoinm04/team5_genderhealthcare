package com.ghsms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "TestOrders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TestOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "TestID")
    private Long testId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "StaffID")
    private User staff;

    @Size(max = 100, message = "Test type must be less than 100 characters")
    @Column(name = "TestType", length = 100)
    private String testType;

    @Size(max = 50, message = "Status must be less than 50 characters")
    @Column(name = "Status", length = 50)
    private String status;

    @Size(max = 500, message = "Result must be less than 500 characters")
    @Column(name = "Result", length = 500)
    private String result;

    @CreationTimestamp
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "DeliveredAt")
    private LocalDateTime deliveredAt;
}

