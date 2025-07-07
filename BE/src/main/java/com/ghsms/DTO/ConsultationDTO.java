package com.ghsms.DTO;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.ghsms.file_enum.ConsultationStatus;
import com.ghsms.file_enum.ServiceCategoryType;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ConsultationDTO {

    private Long consultationId;

    @NotNull(message = "ID khách hàng không được để trống")
    @Positive(message = "ID khách hàng phải là số dương")
    private Long customerId;

    @NotNull(message = "ID tư vấn viên không được để trống")
    @Positive(message = "ID tư vấn viên phải là số dương")
    private Long consultantId;

    @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại phải bắt đầu bằng 0 và có 10 số")
    private String customerPhone;

    @Size(max = 255, message = "Chủ đề phải ít hơn 255 ký tự")
    private String topic;

    @Size(max = 1000, message = "Ghi chú không được vượt quá 1000 ký tự")
    private String note;

    @NotNull(message = "Booking date is required")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Ngày phải đúng định dạng yyyy-MM-dd")
    private String dateScheduled;

    @NotNull(message = "Trạng thái không được để trống")
    private ConsultationStatus status;

    @Min(value = 1, message = "Đánh giá phải từ 1 đến 5 sao")
    @Max(value = 5, message = "Đánh giá phải từ 1 đến 5 sao")
    private Integer rating;

    @Size(max = 500, message = "Phản hồi không được vượt quá 500 ký tự")
    private String feedback;

    // ✅ THÊM MỚI: Booking ID (quan hệ one-to-one)
    @NotNull(message = "Booking ID không được để trống")
    @Positive(message = "Booking ID phải là số dương")
    private Long bookingId;

    // ✅ THÊM MỚI: Time slot với validation pattern
    @Pattern(
            regexp = "^\\d{2}:\\d{2}-\\d{2}:\\d{2}$",
            message = "Time slot phải đúng định dạng HH:mm-HH:mm (ví dụ: 10:00-11:00)"
    )
    private String timeSlot;

    private String meetLink;

    // ✅ THÊM MỚI: Thời gian cập nhật
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime startTime;

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime endTime;


    // ✅ THÊM MỚI: Thông tin bổ sung cho frontend (không cần validation)
    private String customerName;
    private String customerEmail;
    private String consultantName;
    private String consultantEmail;
    private String statusDescription;



    private List<String> serviceNames;

    private List<ServiceCategoryType> categoryTypes;



    // ✅ THÊM MỚI: Validation tùy chỉnh cho time slot
    @AssertTrue(message = "Time slot phải có thời gian kết thúc sau thời gian bắt đầu")
    public boolean isValidTimeSlot() {
        if (timeSlot == null || timeSlot.trim().isEmpty()) {
            return true; // Cho phép null, @Pattern sẽ xử lý
        }

        try {
            String[] times = timeSlot.split("-");
            if (times.length != 2) return false;

            String[] startTime = times[0].split(":");
            String[] endTime = times[1].split(":");

            int startHour = Integer.parseInt(startTime[0]);
            int startMinute = Integer.parseInt(startTime[1]);
            int endHour = Integer.parseInt(endTime[0]);
            int endMinute = Integer.parseInt(endTime[1]);

            int startTotalMinutes = startHour * 60 + startMinute;
            int endTotalMinutes = endHour * 60 + endMinute;

            return endTotalMinutes > startTotalMinutes;
        } catch (Exception e) {
            return false;
        }
    }

    public Long getDurationMinutes() {
        if (startTime != null && endTime != null) {
            return ChronoUnit.MINUTES.between(startTime, endTime);
        }
        return null;
    }
}
