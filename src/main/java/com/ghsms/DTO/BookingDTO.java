package com.ghsms.DTO;

    import com.ghsms.file_enum.BookingStatus;
    import com.ghsms.file_enum.ServiceBookingCategory;
    import jakarta.persistence.Column;
    import jakarta.validation.constraints.Pattern;
    import lombok.Data;
    import jakarta.validation.constraints.NotNull;
    import lombok.Getter;
    import lombok.RequiredArgsConstructor;
    import lombok.Setter;

    import java.time.LocalDate;
    import java.util.List;
@RequiredArgsConstructor
@Getter
@Setter
@Data
public class BookingDTO {
    private Long bookingId;

    @NotNull(message = "User ID is required")
    private Long userId;

    private List<Long> serviceIds;

    public BookingDTO(Long bookingId, Long userId, List<Long> serviceIds, String bookingDate, String timeSlot, String paymentCode, BookingStatus status, String serviceName, ServiceBookingCategory category, String customerName) {
        this.bookingId = bookingId;
        this.userId = userId;
        this.serviceIds = serviceIds;
        this.bookingDate = bookingDate;
        this.timeSlot = timeSlot;
        this.paymentCode = paymentCode;
        this.status = status;
        this.serviceName = serviceName;
        this.category = category;
        this.customerName = customerName;
    }

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
    private String serviceName;
    private ServiceBookingCategory category;
    private String customerName;




}