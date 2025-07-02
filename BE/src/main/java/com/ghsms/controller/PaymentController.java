package com.ghsms.controller;

import com.ghsms.DTO.PaymentRequestDTO;
import com.ghsms.service.VnpayService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/payment")
public class PaymentController {

    private final VnpayService vnpayService;

    @PostMapping("/create")
    public ResponseEntity<?> createPayment(@Valid @RequestBody PaymentRequestDTO paymentRequest,
                                           HttpServletRequest request) {
        String ipAddr = request.getRemoteAddr();
        if ("0:0:0:0:0:0:0:1".equals(ipAddr)) {
            ipAddr = "127.0.0.1"; // ⚠️ bắt buộc đổi để tránh lỗi chữ ký
        }
        String paymentUrl = vnpayService.createPaymentUrl(
                paymentRequest.getBookingId(),
                paymentRequest.getAmount(),
                ipAddr // ✅ truyền lại
        );
        return ResponseEntity.ok(Map.of("paymentUrl", paymentUrl));
    }


}

