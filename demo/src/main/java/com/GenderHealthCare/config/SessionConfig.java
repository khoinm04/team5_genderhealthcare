package com.GenderHealthCare.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;


public class SessionConfig {
    @Bean
    public CookieSerializer cookieSerializer() {
        DefaultCookieSerializer serializer = new DefaultCookieSerializer();
        serializer.setCookieName("JSESSIONID");
        serializer.setCookiePath("/");

        // kiểm tra tính bảo mật cảu mật khẩu
        serializer.setDomainNamePattern("^.+?\\.(\\w+\\.[a-z]+)$");
        serializer.setSameSite("None"); // Changed from Lax to None for cross-origin
        serializer.setUseSecureCookie(true); // Enable secure cookie
        return serializer;

        //check connect từ frontend qua backend
    }
}
