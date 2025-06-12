package com.ghsms.controller;

import com.ghsms.DTO.UserDTO;
import com.ghsms.model.Root;
import com.ghsms.model.User;
import com.ghsms.service.CustomOAuth2UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping(value = "/gender-health-care", produces = "application/json;charset=UTF-8")
@RequiredArgsConstructor
public class UserController {
    private final CustomOAuth2UserService customOAuth2UserService;

    @GetMapping("/signingoogle")
    public ResponseEntity<?> currentuser(Authentication authentication,
                                         HttpSession session) {
        if (authentication == null || !(authentication instanceof OAuth2AuthenticationToken)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập");
        }
        OAuth2AuthenticationToken oAuth2AuthenticationToken = (OAuth2AuthenticationToken) authentication;
        Root userInfo = toPerson(oAuth2AuthenticationToken.getPrincipal().getAttributes());

        try {
            User savedUser = customOAuth2UserService.processOAuthPostLogin(
                    userInfo.getUserID(),
                    userInfo.getEmail(),
                    userInfo.getName(),
                    userInfo.getPicture()
            );

            // Store user in session
            UserDTO userDTO = new UserDTO(savedUser);
            session.setAttribute("currentUser", savedUser);
            // chuyen sang DTO
            return ResponseEntity.ok()
                    .contentType(MediaType.APPLICATION_JSON) // MediaType.APPLICATION_JSON_UTF8 đã deprecated rồi nhé
                    .body(Map.of(
                            "message", "Đăng nhập thành công",
                            "user", userDTO,
                            "redirectUrl", "http://localhost:5173",
                            "sessionId", session.getId()
                    ));

        } catch (Exception e) {
            e.printStackTrace(); // ← xem lỗi chi tiết
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Đăng nhập thất bại");

        }
    }

    @GetMapping("/current-session")
    public ResponseEntity<?> getCurrentSession(HttpSession session) {
        User currentUser = (User) session.getAttribute("currentUser");
        if (currentUser != null) {
            return ResponseEntity.ok(currentUser);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("No active session");
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpSession session) {
        session.invalidate();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }


    public Root toPerson(Map<String, Object> map) {
        if (map == null || map.isEmpty()) {
            return null;
        }
        Root root = new Root();
        root.setUserID((Long) map.get("id")); // Giả sử id là Long
        root.setEmail((String) map.get("email"));
        root.setName((String) map.get("name"));
        root.setPicture((String) map.get("picture"));
        return root;
    }
}
