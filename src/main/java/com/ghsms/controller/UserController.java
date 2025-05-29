package com.ghsms.controller;

import com.ghsms.model.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Set;

@RestController
@RequestMapping("/api")
public class UserController {

    @GetMapping("/user/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body("Người dùng chưa được xác thực.");
        }

        CurrentUserResponse response = new CurrentUserResponse(
                currentUser.getUserId(),
                currentUser.getFullName(),
                currentUser.getEmail(),
                currentUser.getImageUrl(),
                Set.of(currentUser.getRole().getDisplayName())
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/admin/greeting")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public String adminGreeting() {
        return "Xin chào Quản trị viên từ API!";
    }

    static class CurrentUserResponse {
        public Long id;
        public String name;
        public String email;
        public String imageUrl;
        public Set<String> roles;

        public CurrentUserResponse(Long id, String name, String email, String imageUrl, Set<String> roles) {
            this.id = id;
            this.name = name;
            this.email = email;
            this.imageUrl = imageUrl;
            this.roles = roles;
        }
    }
}
