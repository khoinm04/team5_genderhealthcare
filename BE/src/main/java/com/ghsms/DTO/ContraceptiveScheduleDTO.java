package com.ghsms.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ContraceptiveScheduleDTO {
    private Long id;

    private Long userId;

    @NotNull(message = "Loại thuốc không được để trống")
    @Pattern(regexp = "^(21|28)$", message = "Type must be either '21' or '28'")
    private String type;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate startDate;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate endDate;

    @JsonFormat(pattern = "HH:mm:ss")
    @NotNull(message = "Giờ uống thuốc không được để trống")
    private LocalTime pillTime;

    @Min(value = 0, message = "số viên hiện tại phải lớn hơn hoặc bằng 0")
    @Max(value = 27, message = "Số viên hiện tại không thể lớn hơn 27")
    private int currentIndex;

    @NotNull(message = "Lịch uống thuốc không để trống")
    private boolean isActive;

    private LocalDate startBreakDay;

    private LocalDate lastCheckedDate;

    @Size(max = 255, message = "Tên thuốc không được vượt quá 255 ký tự")
    private String medicineName;
    private LocalDate createAt;

    private String note;
}
