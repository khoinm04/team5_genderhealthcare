package com.ghsms.DTO;

import jakarta.validation.constraints.Pattern;

import java.io.Serializable;

public class UserUpdateDTO implements Serializable {
    private String name;
    private String email;

    @Pattern(
            regexp = "^ROLE_(CUSTOMER|CONSULTANT|ADMIN|MANAGER|STAFF)$",
            message = "Role không hợp lệ"
    )
    private String roleName;
    private Boolean isActive;


    public UserUpdateDTO() {
    }

    public UserUpdateDTO(String name, String email, String roleName, Boolean isActive) {
        this.name = name;
        this.email = email;
        this.roleName = roleName;
        this.isActive = isActive;

    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRoleName() {
        return roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public Boolean getIsActive() {
        return isActive;
    }

    public void setIsActive(Boolean isActive) {
        this.isActive = isActive;
    }
}
