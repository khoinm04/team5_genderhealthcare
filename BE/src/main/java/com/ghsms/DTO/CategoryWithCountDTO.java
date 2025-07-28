package com.ghsms.DTO;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryWithCountDTO {
    private Long id;
    private String name;
    private Long count;
}
