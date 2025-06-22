package com.ghsms.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class ContraceptiveScheduleDTO {
    private Long id;               // ID của lịch uống thuốc (nếu thêm mới thì để null)

    private Long userId;           // ID của user đăng ký lịch uống thuốc

    @NotNull(message = "Type cannot be null")
    @Pattern(regexp = "^(21|28)$", message = "Type must be either '21' or '28'")
    private String type;           // "21" hoặc "28"

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @NotNull(message = "Start date cannot be null")
    private LocalDate startDate;

    @JsonFormat(pattern = "HH:mm:ss")
    @NotNull(message = "Pill time cannot be null")
    private LocalTime pillTime;    // Giờ uống thuốc mỗi ngày

    @Min(value = 0, message = "Current index must be at least 0")
    @Max(value = 27, message = "Current index cannot exceed 27")
    private int currentIndex;      // Đang ở viên số mấy (0 là viên đầu tiên)

    @NotNull(message = "Active status cannot be null")
    private boolean isActive;      // Lịch này có đang hoạt động không

    private LocalDate breakUntil;
}
