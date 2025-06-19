package com.ghsms.service;

import com.ghsms.DTO.NotificationDTO;
import com.ghsms.model.Notification;
import com.ghsms.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    public List<NotificationDTO> getNotificationsByUser(Long userId) {
        List<Notification> notifications = notificationRepository.findByUserUserIdOrderByCreatedAtDesc(userId);
        return notifications.stream().map(this::toDTO).collect(Collectors.toList());
    }

    public void markAsRead(Long notificationId){
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Khồng tìm thấy thông báo"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    private NotificationDTO toDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setNotificationId(notification.getNotificationId());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.isRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}
