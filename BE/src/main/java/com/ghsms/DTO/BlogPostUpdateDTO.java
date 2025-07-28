package com.ghsms.DTO;


import lombok.Data;

import java.time.LocalDateTime;

@Data
public class BlogPostUpdateDTO {
    private String title;
    private String content;
    private String excerpt;
    private Long categoryId;
    private String status;
    private LocalDateTime publishTime;
    private String imageUrl;




}
