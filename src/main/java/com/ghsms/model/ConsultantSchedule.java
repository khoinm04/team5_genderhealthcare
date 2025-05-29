package com.ghsms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "ConsultantSchedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultantSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ScheduleID")
    private Integer scheduleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ConsultantID", nullable = false)
    private User consultant;

    @Column(name = "DateScheduled")
    private LocalDate dateScheduled;

    @Size(max = 50, message = "Time slot must be less than 50 characters")
    @Column(name = "TimeSlot", length = 50)
    private String timeSlot;

    @Column(name = "IsAvailable", columnDefinition = "BIT DEFAULT 1")
    private boolean isAvailable = true;
}

