package com.ghsms.mapper;

import com.ghsms.DTO.UserDTO;
import com.ghsms.DTO.UserInfoDTO;
import com.ghsms.model.CustomerDetails;
import com.ghsms.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {
    public UserDTO toDto(User user) {
        return new UserDTO(user, true); // ✅ true vì đang online
    }

    public static UserInfoDTO fromEntity(CustomerDetails details) {
        UserInfoDTO dto = new UserInfoDTO();
        dto.setFullName(details.getFullName());
        dto.setAge(details.getAge());
        dto.setGender(details.getGender());
        dto.setPhone(details.getPhoneNumber());
        dto.setEmail(details.getEmail());
        return dto;
    }


}

