package com.ghsms.repository;

import com.ghsms.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogPostRepository extends JpaRepository<BlogPost, Long> {
    // Có thể thêm tìm kiếm nâng cao nếu cần
}