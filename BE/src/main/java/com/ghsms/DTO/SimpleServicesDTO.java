package com.ghsms.DTO;

import java.math.BigDecimal;

public record SimpleServicesDTO(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String duration,
        String preparation,
        String category
) {}
