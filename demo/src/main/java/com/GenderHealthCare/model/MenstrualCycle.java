package com.GenderHealthCare.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "MenstrualCycles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MenstrualCycle {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CycleID")
    private Long cycleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", nullable = false)
    private User customer;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    @Column(name = "StartDate")
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    @Column(name = "EndDate")
    private LocalDate endDate;

    @Size(max = 255, message = "Chú thích nên ít hơn 255 ký tự")
    @Column(name = "Notes", length = 255)
    private String notes;
}
