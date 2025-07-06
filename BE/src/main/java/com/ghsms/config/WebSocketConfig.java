package com.ghsms.config;

import com.ghsms.model.User;
import com.ghsms.service.JwtService;
import com.ghsms.service.UserService;
import com.ghsms.websocket.CustomHandshakeHandler;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.scheduling.concurrent.ThreadPoolTaskScheduler;
import org.springframework.web.socket.config.annotation.*;


@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
@Slf4j
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Autowired
    private final JwtService jwtService;
    @Autowired
    private final UserService userService;

    @Bean
    public TaskScheduler webSocketHeartbeatScheduler() {
        ThreadPoolTaskScheduler scheduler = new ThreadPoolTaskScheduler();
        scheduler.setPoolSize(1);
        scheduler.setThreadNamePrefix("ws-heartbeat-");
        scheduler.initialize();
        return scheduler;
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        log.info("👉 Registering /ws STOMP endpoint");
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("http://localhost:5173"); // Be specific about allowed origin
    }

    @Override
    public void configureWebSocketTransport(WebSocketTransportRegistration registration) {
        registration.setMessageSizeLimit(128 * 1024)
                .setSendBufferSizeLimit(512 * 1024)
                .setSendTimeLimit(20 * 1000);
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.setApplicationDestinationPrefixes("/app")
                .enableSimpleBroker("/topic", "/queue")
                .setHeartbeatValue(new long[]{10000, 10000})
                .setTaskScheduler(webSocketHeartbeatScheduler());
    }

    @Override
    public void configureClientInboundChannel(ChannelRegistration registration) {
        registration.interceptors(new ChannelInterceptor() {
            @Override
            public Message<?> preSend(Message<?> message, MessageChannel channel) {
                StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

                if (StompCommand.CONNECT.equals(accessor.getCommand())) {
                    String authHeader = accessor.getFirstNativeHeader("Authorization");
                    log.info("🧾 CONNECT header Authorization: {}", authHeader); // 👈 THÊM DÒNG NÀY

                    if (authHeader != null && authHeader.startsWith("Bearer ")) {
                        String token = authHeader.substring(7); // bỏ "Bearer "

                        try {
                            if (jwtService.isTokenValid(token)) {
                                Long userId = jwtService.extractUserId(token);
                                if (userId != null) {
                                    User user = userService.getUserById(userId);
                                    if (user != null) {
                                        accessor.setUser(new UserPrincipal(user)); // 👈 Gán Principal
                                        log.info("✅ [STOMP] Authenticated user: {}", user.getEmail());
                                    } else {
                                        log.warn("❌ [STOMP] User not found: {}", userId);
                                    }
                                }
                            } else {
                                log.warn("❌ [STOMP] Invalid token in CONNECT");
                            }
                        } catch (Exception e) {
                            log.error("❌ [STOMP] Exception when validating token: {}", e.getMessage(), e);
                        }
                    } else {
                        log.warn("⚠️ [STOMP] No Authorization header in CONNECT");
                    }
                }

                return message;
            }
        });
    }



}