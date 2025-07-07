package com.ghsms.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BlogCommentRequestDTO {
    private Long blogPostId;

    @NotBlank
    @Size(max = 1000)
    private String commentText;

    private Long parentCommentId; // 👈 Thêm field này để xác định phản hồi

}
