package com.ghsms.controller;

import com.ghsms.DTO.UserDTO;
import com.ghsms.config.UserPrincipal;
import com.ghsms.model.User;
import com.ghsms.service.CustomOAuth2UserService;
import com.ghsms.service.JwtService;
import com.ghsms.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.Map;


@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping(value = "/gender-health-care", produces = "application/json;charset=UTF-8")
@RequiredArgsConstructor
public class UserController {
    private final JwtService jwtService;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final UserService userService;

    @GetMapping("/signingoogle")
    public ResponseEntity<?> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Thiếu token");
        }

        try {
            String token = authHeader.substring(7);
            String email = jwtService.extractEmail(token);

            if (!jwtService.isTokenValid(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token không hợp lệ");
            }

            User user = customOAuth2UserService.findUserByEmail(email);
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Không tìm thấy người dùng");
            }

            UserDTO userDTO = new UserDTO(user);
            return ResponseEntity.ok(Map.of(
                    "message", "Lấy thông tin người dùng thành công",
                    "user", userDTO
            ));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Lỗi máy chủ");
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


    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(@AuthenticationPrincipal UserPrincipal user,
                                                 @RequestBody UserDTO updateData) {
        Long userId = user.getId(); // ✅ sẽ không null nếu token hợp lệ
        UserDTO updatedUser = userService.updateProfile(userId, updateData);
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal UserPrincipal user,
                                                 @RequestParam String currentPassword,
                                                 @RequestParam String newPassword) {
        Long userId = user.getId();
        userService.changePassword(userId, currentPassword, newPassword);
        return ResponseEntity.ok("Đổi mật khẩu thành công.");
    }
}
