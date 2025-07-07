package com.ghsms.controller;

import com.ghsms.DTO.CreateUserRequest;
import com.ghsms.DTO.DailyStatsDTO;
import com.ghsms.DTO.UserDTO;
import com.ghsms.DTO.UserUpdateDTO;
import com.ghsms.config.UserPrincipal;
import com.ghsms.file_enum.RoleName;
import com.ghsms.model.Role;
import com.ghsms.model.User;
import com.ghsms.service.AdminStatsService;
import com.ghsms.service.BookingService;
import com.ghsms.service.RoleService;
import com.ghsms.service.UserService;
import com.ghsms.websocket.OnlineUserBroadcaster;
import com.ghsms.websocket.OnlineUserTracker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Slf4j
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;
    private final OnlineUserTracker onlineUserTracker;
    private final OnlineUserBroadcaster onlineUserBroadcaster; // 👈 Thêm broadcaster để phát trực tuyến
    private final BookingService bookingService;
    private final AdminStatsService adminStatsService;

    //tạo nguoi dung moi
    @PostMapping("/create-user")
    public ResponseEntity<String> createUser(@RequestBody CreateUserRequest req) {
        userService.createUserByAdmin(req);
        return ResponseEntity.ok("Tạo tài khoản thành công");
    }

    // Lấy danh sách tất cả user
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        // Lấy danh sách tất cả người dùng
        List<User> allUsers = userService.getAllActiveUsers();

        // Lấy danh sách ID của người dùng đang online
        Set<Long> onlineUserIds = onlineUserTracker.getOnlineUserIds();

        // Tạo danh sách DTO với thuộc tính isOnline được gán
        List<UserDTO> users = allUsers.stream()
                .map(user -> {
                    UserDTO dto = new UserDTO(user);
                    dto.setIsOnline(onlineUserIds.contains(user.getUserId())); // ✅ gán giá trị
                    return dto;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(users);
    }

    // Cập nhật user (không cập nhật password)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateDTO dto,
            @AuthenticationPrincipal UserPrincipal currentUser // 👈 nếu bạn dùng Spring Security
    ) {
        try {
            User updatedUser = userService.updateUserInfo(id, dto, currentUser.getEmail());
            return ResponseEntity.ok().body(updatedUser);
        } catch (IllegalArgumentException | ResponseStatusException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Lỗi hệ thống: " + e.getMessage()));
        }
    }


    // Xóa user theo id
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }


    @MessageMapping("/online")
    public void handle(Principal principal) {
        if (principal instanceof UserPrincipal userPrincipal) {
            Long userId = userPrincipal.getUser().getUserId();
            onlineUserTracker.addUser(userId);
            onlineUserBroadcaster.broadcastOnlineUsers(); // 👈 dùng lại logic chung
        }
    }

    @MessageMapping("/offline")
    public void handleOffline(Principal principal) {
        if (principal instanceof UserPrincipal userPrincipal) {
            Long userId = userPrincipal.getUser().getUserId();
            onlineUserTracker.removeUser(userId);
            onlineUserBroadcaster.broadcastOnlineUsers();
            log.info("📴 [Manual] User marked offline: {}", userId);
        }
    }

    //lay tong so dat lich cho admin thay
    @GetMapping("/stats/bookings/count")
    public ResponseEntity<Long> getTotalBookings() {
        long total = bookingService.getTotalBookings();
        return ResponseEntity.ok(total);
    }

    //lam bang thong ke cho admin theo ngay
    @GetMapping("/daily")
    public List<DailyStatsDTO> getDailyStats() {
        return adminStatsService.getDailyStats();
    }
}

