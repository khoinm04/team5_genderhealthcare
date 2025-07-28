package com.ghsms.repository;

import com.ghsms.file_enum.BlogStatus;
import com.ghsms.model.BlogPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    List<BlogPost> findByStatusAndPublishTimeBefore(BlogStatus status, LocalDateTime time);
    Page<BlogPost> findByStatus(BlogStatus status, Pageable pageable);

    @Query("SELECT SUM(p.views) FROM BlogPost p")
    Long sumTotalViews();
}