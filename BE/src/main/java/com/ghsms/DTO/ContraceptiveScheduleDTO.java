package com.ghsms.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class ContraceptiveScheduleDTO {
    private Long id;               // ID của lịch uống thuốc (nếu thêm mới thì để null)

    private Long userId;           // ID của user đăng ký lịch uống thuốc

    @NotNull(message = "Loại thuốc không được để trống")
    @Pattern(regexp = "^(21|28)$", message = "Type must be either '21' or '28'")
    private String type;           // "21" hoặc "28"

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    @NotNull(message = "Ngày bắt đầu không được để trống")
    private LocalDate startDate;

    @JsonFormat(pattern = "HH:mm:ss")
    @NotNull(message = "Giờ uống thuốc không được để trống")
    private LocalTime pillTime;    // Giờ uống thuốc mỗi ngày

    @Min(value = 0, message = "số viên hiện tại phải lớn hơn hoặc bằng 0")
    @Max(value = 27, message = "Số viên hiện tại không thể lớn hơn 27")
    private int currentIndex;      // Đang ở viên số mấy (0 là viên đầu tiên)

    @NotNull(message = "Lịch uống thuốc không để trống")
    private boolean isActive;      // Lịch này có đang hoạt động không

    private LocalDate breakUntil;


    @NotNull(message = "Biến kiểm tra uống thuốc không để trống")
    private boolean takenToday = false; // Đã uống thuốc hôm nay chưa

    @Min(value = 0, message = "Số lần quên uống thuốc phải lớn hơn hoặc bằng 0")
    @Max(value = 10, message = "Số lần quên uống thuốc không thể lớn hơn 10")
    private int missedCount = 0; // Số lần quên uống thuốc liên tiếp

    private LocalDate lastCheckedDate; // Ngày kiểm tra cuối cùng

    @Valid
    private List<@NotNull LocalDate> missedPillDates = new ArrayList<>(); // Danh
}
