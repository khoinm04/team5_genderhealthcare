package com.GenderHealthCare.model;

import com.GenderHealthCare.enums.ConsultationStatus;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private User customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ConsultantID", nullable = false)
    private User consultant;

    @NotBlank(message = "Chủ đề không được để trống")
    @Size(max = 255, message = "Topic must be less than 255 characters")
    @Column(name = "Topic", length = 255)
    private String topic;

    @Lob // For TEXT type
    @Column(name = "Description")
    private String description;

    @NotNull(message = "Ngày lịch không được để trống")
    @Column(name = "DateScheduled")
    private LocalDateTime dateScheduled;

    @Enumerated(EnumType.STRING)
    @Size(max = 20, message = "Trạng thái không hợp lệ")
    @Column(name = "Status", length = 20)
    private ConsultationStatus status;
}
