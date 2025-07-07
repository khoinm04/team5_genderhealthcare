package com.ghsms.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class BlogCommentResponseDTO {
    private Long commentId;
    private String commentText;
    private String commenterName;
    private String imageUrl;
    private LocalDateTime createdAt;
    private boolean isAuthor;
    private Long parentCommentId;
    private int likes;
    private int dislikes;
}
