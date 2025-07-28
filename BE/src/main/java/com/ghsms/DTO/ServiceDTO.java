package com.ghsms.DTO;




import java.io.Serializable;
import java.math.BigDecimal;

public record ServiceDTO(
        Long id,
        String name,
        String description,
        BigDecimal price,
        String duration,
        String preparation,
        String category
) implements Serializable {}

