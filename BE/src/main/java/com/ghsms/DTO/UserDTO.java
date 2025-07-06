package com.ghsms.DTO;

import com.ghsms.file_enum.AuthProvider;
import com.ghsms.model.User;
import com.ghsms.util.RoleNameConverter;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
import java.time.format.DateTimeFormatter;

@Getter
@Setter
@NoArgsConstructor

public class UserDTO implements Serializable {
    private Long userId;
    private String name;
    private String email;
    private String imageUrl;
    private String phoneNumber;
    private Boolean isActive;
    private String roleName;
    private String createdAt;
    private String lastLogin;
    private AuthProvider authProvider;

    private Boolean isOnline; // ✅ Thêm dòng này

    public UserDTO(User user) {
        this.userId = user.getUserId();
        this.name = user.getName();
        this.email = user.getEmail();
        this.imageUrl = user.getImageUrl();
        this.phoneNumber = user.getPhoneNumber();
        this.isActive = user.getIsActive();
        if (user.getRole() != null) {
            this.roleName = RoleNameConverter.toVietnamese(user.getRole().getName().toString());
        }
        this.lastLogin = user.getLastLogin() != null ?
                user.getLastLogin().format(DateTimeFormatter.ofPattern("M/d/yyyy, h:mm:ss a")) : null;

        this.createdAt = user.getCreatedAt() != null ?
                user.getCreatedAt().format(DateTimeFormatter.ofPattern("M/d/yyyy, h:mm:ss a")) : null;
        this.authProvider = user.getAuthProvider() != null ? user.getAuthProvider() : AuthProvider.LOCAL;
    }

    public UserDTO(User user, Boolean isOnline) {
        this(user);
        this.isOnline = isOnline != null ? isOnline : false;
    }


}
