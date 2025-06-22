package com.ghsms.controller;

import com.ghsms.DTO.UserDTO;
import com.ghsms.DTO.UserUpdateDTO;
import com.ghsms.config.UserPrincipal;
import com.ghsms.file_enum.RoleName;
import com.ghsms.model.Role;
import com.ghsms.model.User;
import com.ghsms.service.RoleService;
import com.ghsms.service.UserService;
import com.ghsms.websocket.OnlineUserTracker;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;
    private final OnlineUserTracker onlineUserTracker;
    private final SimpMessagingTemplate messagingTemplate;


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
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserUpdateDTO dto) {
        try {
            User existingUser = userService.getUserById(id);
            if (existingUser == null) {
                throw new RuntimeException("User not found with id: " + id);
            }

            // 🔒 Không cho phép admin tự chỉnh sửa chính mình
            String currentUserEmail = SecurityContextHolder.getContext().getAuthentication().getName();
            User currentUser = userService.findByEmail(currentUserEmail);

            if (currentUser.getUserId().equals(id) && currentUser.getRole().getName() == RoleName.ROLE_ADMIN) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Admin không được phép chỉnh sửa chính mình"));
            }


            // ... cập nhật bình thường
            if (dto.getName() != null) {
                existingUser.setName(dto.getName());
            }
            if (dto.getEmail() != null) {
                existingUser.setEmail(dto.getEmail());
            }
            existingUser.setIsActive(dto.getIsActive());

            if (dto.getRoleName() != null && !dto.getRoleName().isEmpty()) {
                try {
                    RoleName roleName = RoleName.valueOf(dto.getRoleName());
                    Role role = roleService.findByName(roleName);
                    existingUser.setRole(role);
                } catch (IllegalArgumentException e) {
                    return ResponseEntity.badRequest().body("Role không hợp lệ");
                }
            }

            User savedUser = userService.updateUser(existingUser);
            return ResponseEntity.ok(new UserDTO(savedUser));

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
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

    @GetMapping("/online/count")
    public ResponseEntity<Integer> getOnlineUserCount() {
        return ResponseEntity.ok(onlineUserTracker.countOnlineUsers());
    }

    @MessageMapping("/online")
    public void handle(Principal principal) {
        if (principal instanceof UserPrincipal userPrincipal) {
            Long userId = userPrincipal.getUser().getUserId();
            onlineUserTracker.addUser(userId);

            Set<Long> onlineIds = onlineUserTracker.getOnlineUserIds();
            List<UserDTO> onlineUsers = userService.getUsersByIds(onlineIds).stream()
                    .map(user -> {
                        UserDTO dto = new UserDTO(user);
                        dto.setIsOnline(true);
                        return dto;
                    })
                    .toList();

            messagingTemplate.convertAndSend("/topic/online-users", onlineUsers);
        }
    }




}

