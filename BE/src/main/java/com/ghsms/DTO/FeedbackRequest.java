package com.ghsms.DTO;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class FeedbackRequest {
    @Min(1)
    @Max(5)
    private int rating;

    @Size(max = 500)
    private String feedback;
}
