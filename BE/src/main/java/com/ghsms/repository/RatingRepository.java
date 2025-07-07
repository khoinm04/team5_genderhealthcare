package com.ghsms.repository;

import com.ghsms.model.BlogPost;
import com.ghsms.model.Rating;
import com.ghsms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    Optional<Rating> findByUserAndBlogPost(User user, BlogPost blogPost);
    List<Rating> findAllByBlogPost(BlogPost blogPost);
}
