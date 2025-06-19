package com.ghsms.config;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

public class NotificationWebSocketHandler extends TextWebSocketHandler {
    // Lưu trữ các kết nối WebSocket theo userId
    private static final Map<Long, WebSocketSession> userSessions = new ConcurrentHashMap<>();

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        // Lấy userId từ query parameter: ws://localhost:8080/ws/notifications?userId=123
        String userId = getQueryParam(session, "userId");
        if (userId != null) {
            userSessions.put(Long.parseLong(userId), session);
            System.out.println(" User " + userId + " đã kết nối WebSocket");
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        // Xóa session khi user disconnect
        userSessions.entrySet().removeIf(entry -> entry.getValue().equals(session));
        System.out.println(" Một user đã ngắt kết nối WebSocket");
    }

    /**
     * Gửi thông báo real-time cho user cụ thể
     */
    public static void sendNotificationToUser(Long userId, String message) {
        WebSocketSession session = userSessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                // Tạo JSON message
                String jsonMessage = String.format(
                        "{\"type\":\"notification\",\"message\":\"%s\",\"timestamp\":\"%s\"}",
                        message, LocalDateTime.now()
                );

                session.sendMessage(new TextMessage(jsonMessage));
                System.out.println(" Đã gửi thông báo real-time cho user: " + userId);
            } catch (Exception e) {
                System.err.println(" Lỗi gửi WebSocket: " + e.getMessage());
            }
        }
    }

    private String getQueryParam(WebSocketSession session, String paramName) {
        String query = session.getUri().getQuery();
        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                String[] keyValue = param.split("=");
                if (keyValue.length == 2 && keyValue[0].equals(paramName)) {
                    return keyValue[1];
                }
            }
        }
        return null;
    }
}
