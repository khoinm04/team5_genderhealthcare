package com.ghsms.controller;

import com.ghsms.DTO.UserDTO;
import com.ghsms.DTO.UserUpdateDTO;
import com.ghsms.file_enum.RoleName;
import com.ghsms.model.Role;
import com.ghsms.model.User;
import com.ghsms.service.RoleService;
import com.ghsms.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    // Lấy danh sách tất cả user
    @GetMapping
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        List<UserDTO> users = userService.getAllUsers().stream()
                .map(UserDTO::new)
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

            // Update basic info
            if (dto.getName() != null) {
                existingUser.setName(dto.getName());
            }
            if (dto.getEmail() != null) {
                existingUser.setEmail(dto.getEmail());
            }

            existingUser.setIsActive(dto.getIsActive());

            // Only update role if provided
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
}

