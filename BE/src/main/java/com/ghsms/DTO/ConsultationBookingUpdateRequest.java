package com.ghsms.DTO;

import com.ghsms.file_enum.BookingStatus;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ConsultationBookingUpdateRequest {
    private String customerName;
    private String customerPhone;
    private String bookingDate;   // yyyy-MM-dd
    private String timeSlot;      // "08:00-09:00"
    private Long serviceId;
    private Long consultantId;
    private BookingStatus status;// nullable
}

