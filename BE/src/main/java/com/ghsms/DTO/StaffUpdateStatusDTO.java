package com.ghsms.DTO;

import lombok.Data;

@Data
public class StaffUpdateStatusDTO {
    private Long bookingId;
    private String status; // sẽ được convert sang BookingStatus enum
}
