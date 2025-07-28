package com.ghsms.DTO;

import com.ghsms.file_enum.BlogStatus;
import com.ghsms.model.BlogPost;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BlogPostResponseDTO {
    private Long id;
    private String title;
    private String content;
    private String excerpt;
    private String imageUrl;
    private String categoryName;
    private String consultantName;
    private String status;
    private LocalDateTime createdAt;
    private LocalDateTime publishTime;
    private Long categoryId;
    private Double rating;
    private Integer ratingCount;
    private int views;
    private long commentsCount;



    public BlogPostResponseDTO(BlogPost blogPost, long commentsCount) {
        this.id = blogPost.getBlogId();
        this.title = blogPost.getTitle();
        this.content = blogPost.getContent();
        this.imageUrl = blogPost.getImageUrl();
        this.categoryName = blogPost.getCategory().getName();
        this.excerpt = blogPost.getExcerpt(); // assuming bạn có field này trong entity
        this.consultantName = blogPost.getAuthor().getName();
        this.status = convertStatusToVietnamese(blogPost.getStatus());
        this.createdAt = blogPost.getCreatedAt();
        this.publishTime = blogPost.getPublishTime();
        this.categoryId = blogPost.getCategory().getId();
        this.rating = blogPost.getRating();
        this.ratingCount = blogPost.getRatingCount();
        this.views = blogPost.getViews();
        this.commentsCount= commentsCount;
    }

    private String convertStatusToVietnamese(BlogStatus status) {
        return switch (status.toString()) {
            case "DRAFT" -> "Bản nháp";
            case "PUBLISHED" -> "Đã xuất bản";
            case "SCHEDULED" -> "Đã lên lịch";
            default -> "Không xác định";
        };
    }


}
