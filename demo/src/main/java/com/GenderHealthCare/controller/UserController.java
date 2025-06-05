package com.GenderHealthCare.controller;

import com.GenderHealthCare.DTO.UserDTO;
import com.GenderHealthCare.model.User;
import com.GenderHealthCare.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping(value = "/gender-health-care", produces = "application/json;charset=UTF-8")
@RequiredArgsConstructor
public class UserController {
    private final CustomOAuth2UserService customOAuth2UserService;

    @GetMapping("/signingoogle")
    public ResponseEntity<?> handleGoogleLogin(Authentication authentication, jakarta.servlet.http.HttpSession session) {

        // Kiểm tra xem người dùng đã đăng nhập hay chưa
        if (authentication == null || !(authentication instanceof OAuth2AuthenticationToken)) {
            //gg đã try catch trên api của nó rồi nên ko cần try catch lại
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    //
                    .body(Map.of("message", "Chưa đăng nhập"));
        }

        try {
            OAuth2AuthenticationToken oAuth2Token = (OAuth2AuthenticationToken) authentication;
            UserDTO userDTO = customOAuth2UserService.processGoogleLogin(oAuth2Token.getPrincipal().getAttributes(), session);

            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON)
                    //gg đã try catch trên api của nó rồi nên ko cần try catch lại
                    .body(Map.of(
                            "message", "Đăng nhập thành công",
                            "user", userDTO,
                            "redirectUrl", "http://localhost:5173",
                            "sessionId", session.getId()
                    ));
            //gg đã try catch trên api của nó rồi nên ko cần try catch lại
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Đăng nhập thất bại"));
        }
    }

    @GetMapping("/current-session")
    public ResponseEntity<?> getCurrentSession(HttpSession session) {
        User currentUser = (User) session.getAttribute("currentUser");
        return currentUser != null
                ? ResponseEntity.ok(new UserDTO(currentUser))
                : ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Chưa đăng nhập"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Đăng xuất thành công"));
    }
}
