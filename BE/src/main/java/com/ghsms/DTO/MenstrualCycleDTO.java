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

    @NotNull(message = "Customer ID không được để trống")
    private Long customerId;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate startDate;

    @NotNull(message = "Ngày kết thúc không được để trống")
    private LocalDate endDate;

    @NotNull(message = "Số ngày giữa 2 chu kỳ không được để trống")
    @Min(20) @Max(45)
    private Integer cycleLength;

    @NotNull(message = "Số ngày hành kinh không được để trống")
    @Min(1) @Max(10)
    private Integer menstruationDuration;

    private LocalDate nextPredictedDate;

    private LocalDate ovulationDate;

    @Size(max = 255)
    private String notes;
}

