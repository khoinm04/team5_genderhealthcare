package com.ghsms.service;

import com.ghsms.DTO.NotificationDTO;
import com.ghsms.model.Notification;
import com.ghsms.model.User;
import com.ghsms.repository.NotificationRepository;
import com.ghsms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    @Transactional
    public Notification markAsRead(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo với ID: " + notificationId));
        notification.setRead(true);

        return notificationRepository.save(notification);
    }

    @Transactional
    public void markAllAsReadByUserId(Long userId) {
        List<Notification> unreadNotifications = notificationRepository
                .findByUserUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        for (Notification notification : unreadNotifications) {
            notification.setRead(true);
        }
        notificationRepository.saveAll(unreadNotifications);
    }

    @Transactional
    public void deleteNotification(Long notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy thông báo với ID: " + notificationId));
        notificationRepository.delete(notification);

    }

    public List<NotificationDTO> getUnreadNotifications(Long userId) {
        List<Notification> notifications = notificationRepository
                .findByUserUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        return notifications.stream().map(this::toDTO).collect(Collectors.toList());
    }


    public NotificationDTO toDTO(Notification notification) {
        NotificationDTO dto = new NotificationDTO();
        dto.setNotificationId(notification.getNotificationId());
        dto.setMessage(notification.getMessage());
        dto.setRead(notification.getRead());
        dto.setCreatedAt(notification.getCreatedAt());
        return dto;
    }
}
