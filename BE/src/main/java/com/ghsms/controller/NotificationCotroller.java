package com.ghsms.controller;

import com.ghsms.DTO.NotificationDTO;
import com.ghsms.service.NotificationService;
import jakarta.validation.constraints.Min;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Notifications")
@RequiredArgsConstructor
@Validated
public class NotificationCotroller {
    private final NotificationService notificationService;

    // Lấy tất cả thông báo của user (theo userId)
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotificationsByUser(
            @PathVariable @Min(value = 1, message = "UserId phải lớn hơn 0") Long userId) {
        return ResponseEntity.ok(notificationService.getNotificationsByUser(userId));
    }

    // Đánh dấu đã đọc
    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<Void> markAsRead(
            @PathVariable @Min(value = 1, message = "notificationId phải lớn hơn 0") Long notificationId) {
        notificationService.markAsRead(notificationId);
        return ResponseEntity.noContent().build();
    }
}
