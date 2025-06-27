package com.ghsms.websocket;

import com.ghsms.config.UserPrincipal;
import com.ghsms.service.UserService;
import com.ghsms.websocket.OnlineUserTracker;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;
import com.ghsms.DTO.UserDTO;

import java.security.Principal;
import java.util.ArrayList;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class WebSocketEventListener {

    private final OnlineUserTracker tracker;
    private final OnlineUserBroadcaster broadcaster;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal principal = headerAccessor.getUser();

        if (principal instanceof UserPrincipal userPrincipal) {
            Long userId = userPrincipal.getId();
            tracker.addUser(userId);
            log.debug("User connected: {}", userId);
            broadcaster.broadcastOnlineUsers();
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal principal = headerAccessor.getUser();

        if (principal instanceof UserPrincipal userPrincipal) {
            Long userId = userPrincipal.getId();
            tracker.removeUser(userId);
            log.debug("User disconnected: {}", userId);
            broadcaster.broadcastOnlineUsers();
        }
    }
}