package com.ghsms.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "MenstrualCycleHistory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenstrualCycleHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "HistoryID")
    private Long historyId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "UserID", nullable = false)
    @NotNull(message = "User không được để trống")
    private User user;

    @Column(name = "StartDate", nullable = false)
    @NotNull(message = "Ngày bắt đầu chu kỳ không được để trống")
    @PastOrPresent(message = "Ngày bắt đầu chu kỳ không được trong tương lai")
    private LocalDate startDate;

    @Column(name = "EndDate", nullable = false)
    @NotNull(message = "Ngày kết thúc chu kỳ không được để trống")
    @PastOrPresent(message = "Ngày kết thúc chu kỳ không được trong tương lai")
    private LocalDate endDate;

    @Column(name = "CycleLength", nullable = false)
    @NotNull(message = "Độ dài chu kỳ không được để trống")
    @Min(value = 15, message = "Độ dài chu kỳ phải ít nhất 15 ngày")

    private Integer cycleLength;

    @Column(name = "MenstruationDuration", nullable = false)
    @NotNull(message = "Thời gian hành kinh không được để trống")
    @Min(value = 1, message = "Thời gian hành kinh phải ít nhất 1 ngày")
    @Max(value = 10, message = "Thời gian hành kinh không được vượt quá 10 ngày")
    private Integer menstruationDuration;

    @Column(name = "Note", length = 1000, columnDefinition = "nvarchar(1000)")
    @Size(max = 1000, message = "Ghi chú không được vượt quá 1000 ký tự")
    private String note;

    @CreationTimestamp
    @Column(name = "CreatedAt", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "UpdatedAt")
    private LocalDateTime updatedAt;


}
