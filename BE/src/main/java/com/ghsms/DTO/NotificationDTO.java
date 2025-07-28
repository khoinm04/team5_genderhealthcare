package com.ghsms.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class NotificationDTO {
    private Long notificationId;
    private String message;
    private boolean isRead;
    private LocalDateTime createdAt;


    private String type;
}
