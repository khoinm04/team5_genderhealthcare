package com.ghsms.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.LocalDate;

@Entity
@Table(name = "ContraceptiveSchedules")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class ContraceptiveSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    private User user;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    @Column(name = "StartDate", nullable = false)
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    @Column(name = "EndDate", nullable = false)
    private LocalDate endDate;

    @Column(name = "Type", nullable = false)
    private String type;

    @JsonFormat(pattern = "HH:mm:ss")
    @Column(name = "PillTime", nullable = false)
    private LocalTime pillTime;

    @Column(name = "CurrentIndex", nullable = false)
    private int currentIndex;

    @Column(name = "IsActive", nullable = false)
    private boolean active = true;

    @Column(name = "StartBreakDay")
    private LocalDate startBreakDay;

    @Column(name = "LastCheckedDate")
    private LocalDate lastCheckedDate;


    @Column(name = "MedicineName", length = 255)
    private String medicineName;

    @CreationTimestamp
    @Column(name = "CreateAt" , nullable = false)
    private LocalDateTime createAt;

    @Column(name = "Note", length = 1000, columnDefinition = "nvarchar(1000)")
    private String note;
}
