package com.ghsms.websocket;

import com.ghsms.DTO.UserDTO;
import com.ghsms.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
@Slf4j
public class OnlineUserBroadcaster {
    private final OnlineUserTracker tracker;
    private final UserService userService;
    private final SimpMessagingTemplate messagingTemplate;

    public void broadcastOnlineUsers() {
        Set<Long> onlineIds = tracker.getOnlineUserIds();

        if (onlineIds.isEmpty()) {
            messagingTemplate.convertAndSend("/topic/online-users", List.of());
            return;
        }

        var users = userService.getUsersByIds(onlineIds).stream()
                .map(user -> {
                    UserDTO dto = new UserDTO(user);
                    dto.setIsOnline(true);
                    return dto;
                })
                .toList();

        messagingTemplate.convertAndSend("/topic/online-users", users);
    }
}