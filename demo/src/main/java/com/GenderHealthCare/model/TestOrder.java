package com.GenderHealthCare.model;

import com.GenderHealthCare.enums.TestStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "TestOrders")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
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

    @Size(max = 100, message = "Loại xét nghiệm nên ít hơn 100 ký tự")
    @Column(name = "TestType", length = 100)
    private String testType;

    @Enumerated(EnumType.STRING)
    @Size(max = 20, message = "Trạng thái xét nghiệm không hợp lệ")
    @Column(name = "Status", length = 50)
    private TestStatus status;

    @Size(max = 500, message = "kết quả xét nghiệm nên ít hơn 500 ký tự")
    @Column(name = "Result", length = 500)
    private String result;

    @Builder.Default
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "DeliveredAt")
    private LocalDateTime deliveredAt;
}
