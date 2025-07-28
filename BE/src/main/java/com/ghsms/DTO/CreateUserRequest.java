package com.ghsms.DTO;

import lombok.Data;

import java.util.List;

@Data
public class CreateUserRequest {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String role;

    private List<String> certificates;
}

