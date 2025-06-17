package com.ghsms.repository;

import com.ghsms.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserUserIdAndIsReadFalse(Long userId);
    List<Notification> findByCreatedAtAfter(LocalDateTime date);
}