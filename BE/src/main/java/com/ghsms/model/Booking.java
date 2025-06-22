package com.ghsms.model;

import com.ghsms.file_enum.BookingStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

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
    private CustomerDetails customer;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "Booking_Services",
            joinColumns = @JoinColumn(name = "BookingID"),
            inverseJoinColumns = @JoinColumn(name = "ServiceID")
    )
    private Set<Services> services = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "staff_id")
    private StaffDetails staff;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "consultant_id")
    private ConsultantDetails consultant;

    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Ngày phải đúng định dạng yyyy-MM-dd")
    @Column(name = "BookingDate")
    private String bookingDate;

    @Column(name = "PaymentCode", unique = true)
    private String paymentCode;

    @Pattern(
            regexp = "^\\d{2}:\\d{2}-\\d{2}:\\d{2}$",
            message = "Time slot phải đúng định dạng HH:mm-HH:mm (ví dụ: 10:00-11:00)"
    )
    @Column(name = "TimeSlot")
    private String timeSlot;

    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<TestResult> testResults = new HashSet<>();


    @Enumerated(EnumType.STRING)
    @Column(name = "Status", length = 50)
    private BookingStatus status;

    @CreationTimestamp
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Helper methods
    public void addService(Services service) {
        this.services.add(service);
    }

    public void removeService(Services service) {
        this.services.remove(service);
    }
}