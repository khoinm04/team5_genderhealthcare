package com.ghsms.controller;

import com.ghsms.DTO.UserDTO;
import com.ghsms.DTO.UserInfoDTO;
import com.ghsms.config.UserPrincipal;
import com.ghsms.model.CustomerDetails;
import com.ghsms.model.Root;
import com.ghsms.model.User;
import com.ghsms.service.CustomOAuth2UserService;
import com.ghsms.service.CustomUserDetailsService;
import com.ghsms.service.JwtService;
import com.ghsms.service.UserService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
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

//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(HttpSession session) {
//        session.invalidate();
//        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
//    }


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

//    @PostMapping("/logout")
//    public ResponseEntity<?> logout(HttpSession session) {
//        String loginType = (String) session.getAttribute("loginType");
//        session.invalidate();
//
//        if ("google".equals(loginType)) {
//            String redirectAfterLogout = "http://localhost:5173"; // về trang chủ
//            String googleLogout = "https://accounts.google.com/Logout?continue=" +
//                    "https://appengine.google.com/_ah/logout?continue=" + redirectAfterLogout;
//
//            return ResponseEntity.ok(Map.of("logoutUrl", googleLogout));
//        }
//
//        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
//    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(@AuthenticationPrincipal UserPrincipal user,
                                                 @RequestBody UserDTO updateData) {
        Long userId = user.getId(); // ✅ sẽ không null nếu token hợp lệ
        UserDTO updatedUser = userService.updateProfile(userId, updateData);
        return ResponseEntity.ok(updatedUser);
    }



    // Đổi mật khẩu
    @PutMapping("/change-password")
    public ResponseEntity<String> changePassword(@AuthenticationPrincipal UserPrincipal user,
                                                 @RequestParam String currentPassword,
                                                 @RequestParam String newPassword) {
        Long userId = user.getId();
        userService.changePassword(userId, currentPassword, newPassword);
        return ResponseEntity.ok("Đổi mật khẩu thành công.");
    }



}
