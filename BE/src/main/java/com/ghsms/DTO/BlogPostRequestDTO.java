package com.ghsms.DTO;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BlogPostRequestDTO {
    private String title;
    private String content;
    private String excerpt;
    private String status;
    private String imageUrl;
    private Long categoryId;
    private LocalDateTime publishTime;

}
