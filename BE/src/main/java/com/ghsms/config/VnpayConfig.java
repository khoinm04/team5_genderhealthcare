package com.ghsms.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Getter
@Setter
@Component
@ConfigurationProperties(prefix = "vnpay")
public class VnpayConfig {
    private String tmnCode;
    private String hashSecret;
    private String apiUrl;
    private String returnUrl;
}
