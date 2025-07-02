package com.ghsms.DTO;

import com.ghsms.file_enum.ConsultantSpecialization;
import lombok.Data;

import java.util.List;

@Data
public class CreateUserRequest {
    private String name;
    private String email;
    private String password;
    private String phoneNumber;
    private String role; // ví dụ: "Khách hàng", "Tư vấn viên",...

    private List<String> certificates;
}

