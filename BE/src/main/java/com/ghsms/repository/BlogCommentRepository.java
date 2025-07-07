package com.ghsms.repository;

import com.ghsms.model.BlogComment;
import com.ghsms.model.BlogPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BlogCommentRepository extends JpaRepository<BlogComment, Long> {
    List<BlogComment> findByBlogPostOrderByCreatedAtAsc(BlogPost blogPost);
}
