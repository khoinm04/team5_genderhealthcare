package com.ghsms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "CustomerSchedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class CustomerSchedule {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ScheduleID")
    private Long scheduleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", nullable = false)
    private User customer;

    @Column(name = "DateScheduled")
    private LocalDate dateScheduled;

    @Size(max = 50, message = "Time slot must be less than 50 characters")
    @Column(name = "TimeSlot", length = 50)
    private String timeSlot;

    @Size(max = 255, message = "Note must be less than 255 characters")
    @Column(name = "Note", length = 255)
    private String note;
}