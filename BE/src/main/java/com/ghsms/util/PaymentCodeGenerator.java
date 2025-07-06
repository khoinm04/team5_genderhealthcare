package com.ghsms.util;

import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Random;

@Component
public class PaymentCodeGenerator {
    private static final String PREFIX = "PAY";
    private static final Random random = new Random();

    public String generatePaymentCode() {
        // Format: PAY-YYYYMMDD-XXXX (where X is random number)
        LocalDateTime now = LocalDateTime.now();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyyMMdd");
        String datePart = now.format(formatter);
        String randomPart = String.format("%04d", random.nextInt(10000));

        return String.format("%s-%s-%s", PREFIX, datePart, randomPart);
    }
}