package com.ghsms.DTO;

import lombok.Data;

@Data
public class RatingRequestDTO {
    private Long blogPostId;
    private int rating;
}
