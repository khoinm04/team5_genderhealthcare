package com.ghsms.DTO;

import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.io.Serializable;
import java.util.List;

@Data
public class UserUpdateDTO implements Serializable {
    private String name;
    private String email;

    @Pattern(
            regexp = "^ROLE_(CUSTOMER|CONSULTANT|ADMIN|MANAGER|STAFF)$",
            message = "Role không hợp lệ"
    )
    private String roleName;
    private Boolean isActive;

    private List<CertificateDTO> certificates;
    public UserUpdateDTO() {
    }

    public UserUpdateDTO(String name, String email, String roleName, Boolean isActive) {
        this.name = name;
        this.email = email;
        this.roleName = roleName;
        this.isActive = isActive;

    }

}
