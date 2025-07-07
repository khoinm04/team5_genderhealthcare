package com.ghsms.DTO;

import lombok.Data;

@Data
public class RatingRequestDTO {
    private Long blogPostId;
    private int rating; // giá trị từ 1 đến 5
}
