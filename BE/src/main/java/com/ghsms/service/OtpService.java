package com.ghsms.service;

import com.ghsms.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MailService mailService;

    private final Map<String, OtpData> otpStorage = new ConcurrentHashMap<>();

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

        String htmlBody = String.format("""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <div style="max-width: 500px; margin: auto; background-color: #fefefe; padding: 20px; border-radius: 8px; box-shadow: 0 0 8px rgba(0,0,0,0.05);">
                <h2 style="color: #007bff;">🔐 Mã OTP đặt lại mật khẩu</h2>
                <p>Xin chào,</p>
                <p>Mã OTP của bạn là:</p>
                <p style="font-size: 24px; font-weight: bold; color: #d63384;">%s</p>
                <p>Mã có hiệu lực trong <strong>%d phút</strong>. Vui lòng không chia sẻ mã này cho bất kỳ ai.</p>
                <p style="margin-top: 24px;">Trân trọng,<br><strong>Hệ thống GHSMS</strong></p>
            </div>
        </body>
        </html>
    """, otp, OTP_VALID_DURATION);

        mailService.sendHtmlEmail(email, subject, htmlBody);
        return true;
    }




    private String generateOtp() {
        SecureRandom secureRandom = new SecureRandom();
        int otp = 100000 + secureRandom.nextInt(900000);
        return String.valueOf(otp);
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