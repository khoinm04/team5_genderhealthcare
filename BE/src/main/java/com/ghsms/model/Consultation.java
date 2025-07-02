package com.ghsms.model;

import com.ghsms.file_enum.ConsultationStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "Consultations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ConsultationID")
    private Long consultationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", nullable = false)
    private CustomerDetails customer;


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ConsultantID")
    private ConsultantDetails consultant;


    @Size(max = 255, message = "Chủ đề phải ít hơn 255 ký tự")
    @Column(name = "Topic", length = 255)
    private String topic;

    @Size(max = 1000, message = "Ghi chú phải ít hơn 1000 ký tự")
    @Column(name = "Note", length = 1000)
    private String note;

    @Column(name = "DateScheduled")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Ngày phải đúng định dạng yyyy-MM-dd")
    private String dateScheduled;

    @Enumerated(EnumType.STRING)
    @Column(name = "Status", length = 50, nullable = false)
    @NotNull(message = "Trạng thái không được để trống")
    private ConsultationStatus status;


    // ✅ THÊM MỚI: Đánh giá từ khách hàng
    @Column(name = "Rating")
    private Integer rating; // 1-5 sao

    @Size(max = 500, message = "Phản hồi phải ít hơn 500 ký tự")
    @Column(name = "Feedback", length = 500)
    private String feedback;

    // ✅ THÊM MỚI: Quan hệ one-to-one với Booking
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "BookingID", nullable = false)
    @NotNull(message = "Booking không được để trống")
    private Booking booking;

    @UpdateTimestamp
    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;

    @Pattern(
            regexp = "^\\d{2}:\\d{2}-\\d{2}:\\d{2}$",
            message = "Time slot phải đúng định dạng HH:mm-HH:mm (ví dụ: 10:00-11:00)"
    )
    @Column(name = "TimeSlot")
    private String timeSlot;





}

