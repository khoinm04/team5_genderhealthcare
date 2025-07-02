package com.ghsms.service;

import com.ghsms.config.VnpayConfig;
import jakarta.xml.bind.DatatypeConverter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VnpayService {

    private final VnpayConfig vnpayConfig;

    public String createPaymentUrl(Long bookingId, int amount, String ipAddr) {
        String vnpVersion = "2.1.0";
        String vnpCommand = "pay";
        String vnpTxnRef = String.valueOf(System.currentTimeMillis());
        String vnpOrderInfo = "Thanh_toan_dat_lich_" + bookingId;

        Map<String, String> vnpParams = new HashMap<>();
        vnpParams.put("vnp_Version", vnpVersion);
        vnpParams.put("vnp_Command", vnpCommand);
        vnpParams.put("vnp_TmnCode", vnpayConfig.getTmnCode());
        vnpParams.put("vnp_Amount", String.valueOf(amount * 100)); // nhân 100
        vnpParams.put("vnp_CurrCode", "VND");
        vnpParams.put("vnp_TxnRef", vnpTxnRef);
        vnpParams.put("vnp_OrderInfo", vnpOrderInfo);
        vnpParams.put("vnp_Locale", "vn");
        vnpParams.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
        vnpParams.put("vnp_CreateDate", LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
        vnpParams.put("vnp_IpAddr", ipAddr); // ✅ Đây chính là dòng cần thêm


        // **Thêm dòng này**
        vnpParams.put("vnp_OrderType", "other");

        List<String> fieldNames = new ArrayList<>(vnpParams.keySet());
        Collections.sort(fieldNames);

        StringBuilder hashData = new StringBuilder();
        StringBuilder query = new StringBuilder();

        for (String field : fieldNames) {
            String value = vnpParams.get(field);
            if (value != null && !value.isEmpty()) {
                hashData.append(field).append('=').append(value).append('&');
                query.append(field).append('=').append(URLEncoder.encode(value, StandardCharsets.UTF_8)).append('&');
            }
        }

        hashData.setLength(hashData.length() - 1); // remove last &
        String secureHash = hmacSHA512(vnpayConfig.getHashSecret(), hashData.toString());
        query.append("vnp_SecureHash=").append(secureHash);
        System.out.println("👉 HASH SECRET: [" + vnpayConfig.getHashSecret() + "]");
        System.out.println("🔍 HASH DATA: [" + hashData.toString() + "]");
        System.out.println("🔍 GENERATED HASH: [" + secureHash + "]");
        System.out.println("🔗 FINAL QUERY STRING: [" + query.toString() + "]");
        System.out.println("🌐 FINAL PAYMENT URL: [" + vnpayConfig.getApiUrl() + "?" + query + "]");

        System.out.println("🔑 HASH SECRET LENGTH = " + vnpayConfig.getHashSecret().length());
        System.out.println("🔑 HASH SECRET RAW = [" + vnpayConfig.getHashSecret() + "]");



        return vnpayConfig.getApiUrl() + "?" + query;
    }


    private String hmacSHA512(String key, String data) {
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(key.getBytes(StandardCharsets.UTF_8), "HmacSHA512");
            Mac mac = Mac.getInstance("HmacSHA512");
            mac.init(secretKeySpec);
            byte[] hmacData = mac.doFinal(data.getBytes(StandardCharsets.UTF_8));
            return DatatypeConverter.printHexBinary(hmacData).toUpperCase();
        } catch (Exception e) {
            throw new RuntimeException("Cannot sign HMAC", e);
        }
    }
}

