package com.ghsms.DTO;

import java.io.Serializable;


public record SimpleServiceDTO(
        Long id,
        String name,
        String category
) implements Serializable {}
