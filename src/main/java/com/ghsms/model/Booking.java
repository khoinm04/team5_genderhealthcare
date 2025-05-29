// src/main/java/com/ghsms/model/Booking.java
    package com.ghsms.model;

    import com.ghsms.file_enum.BookingStatus;
    import jakarta.persistence.*;
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

        @Column(name = "BookingDate")
        private LocalDate bookingDate;

        @Size(max = 50, message = "Time slot must be less than 50 characters")
        @Column(name = "TimeSlot", length = 50)
        private String timeSlot;

        @Enumerated(EnumType.STRING)
        @Column(name = "Status", length = 50)
        private BookingStatus status;

        @CreationTimestamp
        @Column(name = "CreatedAt", nullable = false, updatable = false)
        private LocalDateTime createdAt;
    }