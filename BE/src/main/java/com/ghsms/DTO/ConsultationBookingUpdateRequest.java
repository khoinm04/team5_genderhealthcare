package com.ghsms.DTO;

import com.ghsms.file_enum.BookingStatus;
import com.ghsms.file_enum.ConsultationStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ConsultationBookingUpdateRequest {
    private String customerName;
    private String customerPhone;
    private String bookingDate;
    private String timeSlot;
    private Long serviceId;
    private Long consultantId;
    private BookingStatus status;
    private ConsultationStatus consultationStatus;

}

