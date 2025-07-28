package com.ghsms.DTO;

import com.ghsms.file_enum.BookingStatus;
import com.ghsms.file_enum.ConsultationStatus;
import com.ghsms.file_enum.TestStatus;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.util.List;

@RequiredArgsConstructor
@Getter
@Setter
public class BookingDTO implements Serializable {

    private Long bookingId;
    private Long consultationId;
    private Long testResultId;

    private String feedback;
    private Integer rating;

    private Long userId;

    private Long staffId;

    private Long consultantId;

    private List<Long> serviceIds;

    @NotNull(message = "Booking date is required")
    @Pattern(regexp = "\\d{4}-\\d{2}-\\d{2}", message = "Ngày phải đúng định dạng yyyy-MM-dd")
    private String bookingDate;

    @Pattern(
            regexp = "^\\d{2}:\\d{2}-\\d{2}:\\d{2}$",
            message = "Time slot phải đúng định dạng HH:mm-HH:mm (ví dụ: 10:00-11:00)"
    )
    private String timeSlot;

    private String paymentCode;
    private BookingStatus status;
    private ConsultationStatus consultationStatus;
    private TestStatus testStatus;

    private String category;

    private String customerName;

    @Pattern(regexp = "^0\\d{9}$", message = "Số điện thoại phải bắt đầu bằng 0 và có 10 số")
    private String customerPhone;

    @Email(message = "Email không hợp lệ")
    private String customerEmail;

    private Integer customerAge;
    private String customerGender;

    private String staffName;
    private String consultantName;
    private String client;
    private String serviceName;
    private String date;
    private String startTime;
    private String endTime;

    private List<TestResultDTO> testResults;

    private String topic;
    private String note;

    private Integer amount;

    private String categoryType;

}
