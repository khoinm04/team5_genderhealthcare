package com.ghsms.controller;

import com.ghsms.DTO.NotificationDTO;
import com.ghsms.model.Notification;
import com.ghsms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/Notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<NotificationDTO>> getUserNotifications(@PathVariable Long userId) {
        List<NotificationDTO> notificationDTOs = notificationService.getUnreadNotifications(userId);
        return ResponseEntity.ok(notificationDTOs);
    }

    @PatchMapping("/{notificationId}/read")
    public ResponseEntity<NotificationDTO> markAsRead(@PathVariable Long notificationId) {
        Notification notification = notificationService.markAsRead(notificationId);
        NotificationDTO dto = notificationService.toDTO(notification);
        return ResponseEntity.ok(dto);
    }

    @PatchMapping("/user/{userId}/mark-all-read")
    public ResponseEntity<String> markAllAsRead(@PathVariable Long userId) {
        notificationService.markAllAsReadByUserId(userId);
        return ResponseEntity.ok("Tất cả thông báo đã được đánh dấu là đã đọc");
    }

    @DeleteMapping("/{notificationId}")
    public ResponseEntity<String> deleteNotification(@PathVariable Long notificationId) {
        notificationService.deleteNotification(notificationId);
        return ResponseEntity.ok("Thông báo đã được xóa thành công");
    }
}
