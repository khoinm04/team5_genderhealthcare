package com.ghsms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

@SpringBootApplication
@EnableScheduling
@Slf4j
public class GhsmsApplication {

    public static void main(String[] args) {
        log.info("🚀 Ứng dụng đang khởi động");

        SpringApplication.run(GhsmsApplication.class, args);
    }

}
