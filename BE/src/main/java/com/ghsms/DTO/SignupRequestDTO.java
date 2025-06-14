package com.ghsms.DTO;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import lombok.Setter;

import java.io.Serializable;

@RequiredArgsConstructor
@Getter
@Setter
public class SignupRequestDTO implements Serializable {
    private String fullName;
    private String email;
    private String phone;
    private String password;
}