package com.ghsms.websocket;

import com.ghsms.config.UserPrincipal;
import com.ghsms.model.User;
import com.ghsms.service.JwtService;
import com.ghsms.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.security.Principal;
import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtHandshakeInterceptor implements HandshakeInterceptor {
    private final JwtService jwtService;
    private final UserService userService;

    @Override
    public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response,
                                   WebSocketHandler wsHandler, Map<String, Object> attributes) {
        String token = extractTokenFromQuery(request);
        log.info("🔍 Extracted token: {}", token);

        if (token == null) {
            log.warn("❌ No token found in query");
            response.setStatusCode(HttpStatus.UNAUTHORIZED);
            return false;
        }

        try {
            if (jwtService.isTokenValid(token)) {
                Long userId = jwtService.extractUserId(token);
                if (userId == null) {
                    log.warn("❌ userId is null");
                    response.setStatusCode(HttpStatus.UNAUTHORIZED);
                    return false;
                }
                log.info("🔍 Extracted userId: {}", userId);
                User user = userService.getUserById(userId);
                if (user == null) {
                    log.warn("❌ User not found for userId: {}", userId);
                    response.setStatusCode(HttpStatus.UNAUTHORIZED);
                    return false;
                }
                attributes.put("principal", new UserPrincipal(user));
                log.info("✅ WebSocket handshake successful for user {}", user.getUserId());
                return true;
            } else {
                log.warn("❌ Invalid token");
            }
        } catch (Exception e) {
            log.error("❌ Handshake error: {}", e.getMessage(), e);
        }

        log.warn("❌ WebSocket handshake failed");
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return false;
    }

    private String extractTokenFromQuery(ServerHttpRequest request) {
        URI uri = request.getURI();
        String query = uri.getQuery();
        if (query != null) {
            for (String param : query.split("&")) {
                String[] pair = param.split("=");
                if (pair.length == 2 && pair[0].equals("token")) {
                    log.info("🔍 Found token in query: {}", pair[1]);
                    return pair[1];
                }
            }
        }
        log.warn("❌ No query parameters found");
        return null;
    }

    @Override
    public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response,
                               WebSocketHandler wsHandler, Exception exception) {}
}