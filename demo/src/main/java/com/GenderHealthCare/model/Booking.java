package com.GenderHealthCare.model;
import com.GenderHealthCare.enums.BookingStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "Bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "BookingID")
    private Long bookingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ServiceID", nullable = false)
    private Service service;

    @NotNull(message = "Ngày đặt lịch không được để trống")
    @Column(name = "BookingDate")
    private LocalDate bookingDate;

    @NotBlank(message = "Khung giờ không được để trống")
    @Column(name = "TimeSlot", length = 50)
    private String timeSlot;

    @Enumerated(EnumType.STRING)
    @Size(max = 20, message = "Trạng thái không hợp lệ")
    @Column(name = "Status", length = 20)
    private BookingStatus status;

    @Builder.Default
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();
}