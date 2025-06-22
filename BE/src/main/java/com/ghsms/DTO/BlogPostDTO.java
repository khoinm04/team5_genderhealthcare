package com.ghsms.DTO;

import com.ghsms.model.User;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;


import java.time.LocalDateTime;
@Data
public class BlogPostDTO {
    private Long blogId;

    @NotBlank(message = "Title cannot be blank")
    @Size(max = 255, message = "Title must be less than 255 characters")
    private String title;

    @NotBlank(message = "Content cannot be blank")
    private String content;

    @NotNull(message = "Author ID cannot be null")
    private User author;

    private LocalDateTime createdAt;
}
