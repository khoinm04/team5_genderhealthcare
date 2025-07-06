package com.ghsms.DTO;

import lombok.Data;

@Data

public class PaymentRequestDTO {
    private Long bookingId;
    private int amount;
}

