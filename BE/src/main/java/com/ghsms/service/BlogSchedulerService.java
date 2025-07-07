package com.ghsms.service;

import com.ghsms.DTO.BlogPostResponseDTO;
import com.ghsms.file_enum.BlogStatus;
import com.ghsms.model.BlogPost;
import com.ghsms.repository.BlogPostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class BlogSchedulerService {

    private final SimpMessagingTemplate messagingTemplate;
    private final BlogPostRepository blogPostRepository;

    @Scheduled(fixedRate = 30000)
    public void publishScheduledPosts() {
        LocalDateTime now = LocalDateTime.now();

        List<BlogPost> toPublish = blogPostRepository
                .findByStatusAndPublishTimeBefore(BlogStatus.SCHEDULED, now);

        for (BlogPost post : toPublish) {
            post.setStatus(BlogStatus.PUBLISHED);
            blogPostRepository.save(post);

            // 🔔 Gửi thông báo qua WebSocket
            BlogPostResponseDTO dto = new BlogPostResponseDTO(post);
            messagingTemplate.convertAndSend("/topic/blog-updates", dto);
        }

        if (!toPublish.isEmpty()) {
            System.out.println("Đã xuất bản " + toPublish.size() + " bài viết.");
        }
    }

}
