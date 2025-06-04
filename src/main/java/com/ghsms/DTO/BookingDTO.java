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

    public BookingDTO(String customerName, ServiceBookingCategory category, String serviceName, BookingStatus status, String timeSlot, String bookingDate, List<Long> serviceIds, Long userId, Long bookingId) {
        this.customerName = customerName;
        this.category = category;
        this.serviceName = serviceName;
        this.status = status;
        this.timeSlot = timeSlot;
        this.bookingDate = bookingDate;
        this.serviceIds = serviceIds;
        this.userId = userId;
        this.bookingId = bookingId;
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