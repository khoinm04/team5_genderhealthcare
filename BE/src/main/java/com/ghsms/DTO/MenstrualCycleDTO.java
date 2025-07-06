package com.ghsms.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.io.Serializable;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MenstrualCycleDTO implements Serializable {
    private Long cycleId;

    private Long userId;


    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull(message = "Số ngày giữa 2 chu kỳ không được để trống")
    @Min(value = 20, message = " Nếu số ngày giữa 2 chu kỳ ít hơn 20 ngày thì bạn nên đi kiểm tra sức khỏe")
    @Max(value = 45, message = " Nếu số ngày giữa 2 chu kỳ nhiều hơn 45 ngày thì bạn nên đi kiểm tra sức khỏe")
    private Integer cycleLength;

    @NotNull(message = "Số ngày hành kinh không được để trống")
    @Min(value = 1, message = " Nếu số ngày hành kinh ít hơn 1 ngày thì bạn nên đi kiểm tra sức khỏe")
    @Max(value = 10, message = " Nếu số ngày hành kinh nhiều hơn 10 ngày thì bạn nên đi kiểm tra sức khỏe")
    private Integer menstruationDuration;

    private LocalDate nextPredictedDate;

    private LocalDate predictedOvulationDate;

    private LocalDate predictedFertileWindowStartDate;

    private LocalDate predictedFertileWindowEndDate;


    @Size(max = 255)
    private String notes;
}

