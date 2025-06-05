package com.GenderHealthCare.service;

import com.GenderHealthCare.DTO.Root;
import com.GenderHealthCare.DTO.UserDTO;
import com.GenderHealthCare.enums.RoleName;
import com.GenderHealthCare.model.User;
import com.GenderHealthCare.repository.UserRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService {

    private final UserRepository userRepository;

    public UserDTO processGoogleLogin(Map<String, Object> attributes, HttpSession session) {
        Root userInfo = mapToUserInfo(attributes);

        try {
            User savedUser = processOAuthPostLogin(
                    userInfo.getEmail(),
                    userInfo.getName(),
                    userInfo.getPicture()
            );

            session.setAttribute("currentUser", savedUser);
            return new UserDTO(savedUser);
        } catch (Exception e) {
            throw new RuntimeException("Đăng nhập google thất bại", e);
        }
    }

    public User processOAuthPostLogin(String email, String name, String imageUrl) {
        Optional<User> existUser = userRepository.findByEmail(email);

        if (existUser.isPresent()) {
            return existUser.get();
        }

        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setImageUrl(imageUrl);
        newUser.setRole(RoleName.CUSTOMER);
        newUser.setActive(true);
        newUser.setPasswordHash(null);

        return userRepository.save(newUser);
    }

    private Root mapToUserInfo(Map<String, Object> attributes) {
        Root root = new Root();
        root.setEmail((String) attributes.get("email"));
        root.setName((String) attributes.get("name"));
        root.setPicture((String) attributes.get("picture"));
        return root;
    }
}
