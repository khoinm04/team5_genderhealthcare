package com.ghsms.mapper;

import com.ghsms.DTO.UserDTO;
import com.ghsms.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserDTO toDto(User user) {
        return new UserDTO(user, true); // ✅ true vì đang online
    }
}
