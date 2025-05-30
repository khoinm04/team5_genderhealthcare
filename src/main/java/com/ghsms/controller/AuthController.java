package com.ghsms.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @GetMapping("/login/success")
    public ResponseEntity<?> loginSuccess(@AuthenticationPrincipal OAuth2User oauth2User) {
        Map<String, Object> response = new HashMap<>();
        response.put("email", oauth2User.getAttribute("email"));
        response.put("name", oauth2User.getAttribute("name"));
        return ResponseEntity.ok(response);
    }
}
