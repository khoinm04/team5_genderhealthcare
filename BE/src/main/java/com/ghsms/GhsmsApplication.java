package com.ghsms;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.socket.config.annotation.EnableWebSocket;

@SpringBootApplication
@EnableScheduling
public class GhsmsApplication {

    public static void main(String[] args) {
        SpringApplication.run(GhsmsApplication.class, args);
    }

}
