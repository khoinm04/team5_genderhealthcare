package com.ghsms.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    // Nên khai báo email gửi ở đây (chính là email bạn cấu hình trong application.properties)
    private static final String FROM_EMAIL = "anmom8910@gmail.com";

    public boolean sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(FROM_EMAIL);       // Thêm dòng này để set người gửi rõ ràng
            msg.setTo(to);                 // Người nhận là người dùng
            msg.setSubject(subject);
            msg.setText(text);
            mailSender.send(msg);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
