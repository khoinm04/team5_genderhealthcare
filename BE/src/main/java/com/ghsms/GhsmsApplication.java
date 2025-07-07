package com.ghsms;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

@SpringBootApplication
@EnableScheduling
@EnableAsync  // ✅ Dòng này cực kỳ quan trọng
public class GhsmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(GhsmsApplication.class, args);
    }

}
