package com.ghsms.controller;

import com.ghsms.DTO.CreateUserRequest;
import com.ghsms.DTO.DailyStatsDTO;
import com.ghsms.DTO.UserDTO;
import com.ghsms.DTO.UserUpdateDTO;
import com.ghsms.config.UserPrincipal;
import com.ghsms.model.User;
import com.ghsms.service.*;
import com.ghsms.websocket.OnlineUserBroadcaster;
import com.ghsms.websocket.OnlineUserTracker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.Principal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Slf4j
public class AdminController {

    private final UserService userService;
    private final ConsultationService consultationService;
    private final OnlineUserTracker onlineUserTracker;
    private final OnlineUserBroadcaster onlineUserBroadcaster;
    private final BookingService bookingService;
    private final AdminStatsService adminStatsService;

    @PostMapping("/create-user")
    public ResponseEntity<String> createUser(@RequestBody CreateUserRequest req) {
        userService.createUserByAdmin(req);
        return ResponseEntity.ok("Tạo tài khoản thành công");
    }

    @GetMapping
    public ResponseEntity<Page<UserDTO>> getAllUsers(Pageable pageable) {
        Page<User> usersPage = userService.getAllActiveUsers(pageable); // cần sửa service
        Set<Long> onlineUserIds = onlineUserTracker.getOnlineUserIds();
        Page<UserDTO> result = usersPage.map(user -> {
            UserDTO dto = new UserDTO(user);
            dto.setIsOnline(onlineUserIds.contains(user.getUserId()));
            return dto;
        });

        return ResponseEntity.ok(result);
    }
    @GetMapping("/total")
    public ResponseEntity<Map<String, Long>> getTotalUsers() {
        long total = userService.getTotalUsers();
        Map<String, Long> response = new HashMap<>();
        response.put("totalUsers", total);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(
            @PathVariable Long id,
            @RequestBody UserUpdateDTO dto,
            @AuthenticationPrincipal UserPrincipal currentUser
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
            onlineUserBroadcaster.broadcastOnlineUsers();
        }
    }

    @MessageMapping("/offline")
    public void handleOffline(Principal principal) {
        if (principal instanceof UserPrincipal userPrincipal) {
            Long userId = userPrincipal.getUser().getUserId();
            onlineUserTracker.removeUser(userId);
            onlineUserBroadcaster.broadcastOnlineUsers();
        }
    }

    @GetMapping("/stats/bookings/count")
    public ResponseEntity<Long> getTotalBookings() {
        long total = bookingService.getTotalBookings();
        return ResponseEntity.ok(total);
    }

    @GetMapping("/daily")
    public List<DailyStatsDTO> getDailyStats() {
        return adminStatsService.getDailyStats();
    }

    @GetMapping("/consultations/statistics")
    public ResponseEntity<Map<String, Long>> getAllConsultationStatusCounts() {
        return ResponseEntity.ok(consultationService.getAllConsultationStatusCounts());
    }

}

