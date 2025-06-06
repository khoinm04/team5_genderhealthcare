package com.ghsms.DTO;

import lombok.Data;

@Data
public class LoginRespone {
    private String message;

    public LoginRespone(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}