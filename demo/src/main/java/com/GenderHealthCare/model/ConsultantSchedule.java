package com.GenderHealthCare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "ConsultantSchedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultantSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ScheduleID")
    private Long scheduleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ConsultantID", nullable = false)
    private User consultant;

    @NotNull(message = "Ngày hẹn không được để trống")
    @Column(name = "DateScheduled")
    private LocalDate dateScheduled;

    @Size(max = 50, message = "Khung giờ hẹn nên ít hơn 50 ký tự")
    @NotBlank(message = "Khung giờ hẹn không được để trống")
    @Column(name = "TimeSlot", length = 50)
    private String timeSlot;

    @Builder.Default
    @Column(name = "IsAvailable", columnDefinition = "BIT DEFAULT 1")
    private boolean isAvailable = true;
}
