package com.ghsms.service;

import com.ghsms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailService mailService;

    // Store OTP with expiration time
    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

    // OTP valid duration in minutes (30 minutes)
    private static final int OTP_VALID_DURATION = 30;

    private static class OtpData {
        String otp;
        LocalDateTime expiryTime;

        OtpData(String otp) {
            this.otp = otp;
            this.expiryTime = LocalDateTime.now().plusMinutes(OTP_VALID_DURATION);
        }

        boolean isValid() {
            return LocalDateTime.now().isBefore(expiryTime);
        }
    }

    public boolean sendOtpToEmail(String email) {
        if (!userRepository.existsByEmail(email)) {
            return false;
        }

        String otp = generateOtp();
        otpStorage.put(email, new OtpData(otp));

        String subject = "Mã OTP đặt lại mật khẩu";
        String body = String.format("Mã OTP của bạn là: %s\nMã có hiệu lực trong %d phút.",
                otp, OTP_VALID_DURATION);

        return mailService.sendEmail(email, subject, body);
    }

    private String generateOtp() {
        int randomPin = (int) (Math.random() * 900000) + 100000;
        return String.valueOf(randomPin);
    }

    public boolean verifyOtp(String email, String otp) {
        OtpData otpData = otpStorage.get(email);
        if (otpData == null) {
            return false;
        }

        if (!otpData.isValid()) {
            otpStorage.remove(email);
            return false;
        }

        return otpData.otp.equals(otp);
    }

    public void clearOtp(String email) {
        otpStorage.remove(email);
    }
}