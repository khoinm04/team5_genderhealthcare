package com.ghsms.websocket;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.support.DefaultHandshakeHandler;

import java.security.Principal;
import java.util.Map;
@Slf4j
public class CustomHandshakeHandler extends DefaultHandshakeHandler {
    @Override
    protected Principal determineUser(ServerHttpRequest request,
                                      WebSocketHandler wsHandler,
                                      Map<String, Object> attributes) {
        log.info("👉 [WS] CustomHandshakeHandler.determineUser called");
        Object principal = attributes.get("principal");
        if (principal instanceof Principal p) {
            return p;
        }
        return null;
    }
}
