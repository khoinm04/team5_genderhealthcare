package com.ghsms.websocket;

import lombok.Getter;
import org.springframework.stereotype.Component;

import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

@Getter
@Component
public class OnlineUserTracker {
    private final Map<Long, AtomicInteger> userSessions = new ConcurrentHashMap<>();

    public void addUser(Long userId) {
        userSessions.compute(userId, (id, count) -> {
            if (count == null) return new AtomicInteger(1);
            count.incrementAndGet();
            return count;
        });
    }

    public void removeUser(Long userId) {
        userSessions.computeIfPresent(userId, (id, count) -> {
            if (count.decrementAndGet() <= 0) return null;
            return count;
        });
    }

    public Set<Long> getOnlineUserIds() {
        return userSessions.keySet();
    }

    public int countOnlineUsers() {
        return userSessions.size(); // 👈 Thêm phương thức này
    }
}

