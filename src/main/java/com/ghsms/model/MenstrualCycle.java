package com.ghsms.model;

import com.ghsms.model.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "CustomerID", nullable = false)
    private User customer;

    @NotNull(message = " Ngày bắt đầu không được để trống")
    @Column(name = "StartDate")
    private LocalDate startDate;

    @NotNull(message = " Ngày kết thúc không được để trống")
    @Column(name = "EndDate")
    private LocalDate endDate;

    @NotNull(message =" Số ngày của 2 chu kỳ không được để trống")
    @Min(value = 20, message = " Nếu số ngày giữa 2 chu kỳ ít hơn 20 ngày thì bạn nên đi kiểm tra sức khỏe")
    @Max(value = 45, message = " Nếu số ngày giữa 2 chu kỳ nhiều hơn 45 ngày thì bạn nên đi kiểm tra sức khỏe")
    @Column(name = "CycleLength")
    private Integer cycleLength; // Default value, can be adjusted based on user input

    @NotNull(message =" Số ngày hành kinh không được để trống")
    @Column(name = "MenstruationDuration")
    @Min(value = 1, message = " Nếu số ngày hành kinh ít hơn 1 ngày thì bạn nên đi kiểm tra sức khỏe")
    @Max(value = 10, message = " Nếu số ngày hành kinh nhiều hơn 10 ngày thì bạn nên đi kiểm tra sức khỏe")
    private Integer menstruationDuration; // Default value, can be adjusted based on user input

    @NotNull(message =" Dự báo ngày tiếp theo không được để trống")
    @Column(name = "NextPredictedDate")
    private LocalDate nextPredictedDate;

    @NotNull(message =" Dữ báo ngày rụng trứng không được để trống")
    @Column(name = "PredictedOvulationDate")
    private LocalDate predictedOvulationDate;

    @Column(name = "PredictedFertileWindowStartDate")
    private LocalDate predictedFertileWindowStartDate;

    @Column(name = "PredictedFertileWindowEndDate")
    private LocalDate predictedFertileWindowEndDate;


    @Size(max = 255, message = " Chú thích nên ít hơn 255 ký tự")
    @Column(name = "Notes", length = 255)
    private String notes;

    //cần bổ sung the previous start date và end date of the cycle:

}
