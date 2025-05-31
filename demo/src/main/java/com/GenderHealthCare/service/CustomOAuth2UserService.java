package com.GenderHealthCare.service;

import com.GenderHealthCare.enums.RoleName;
import com.GenderHealthCare.model.Role;
import com.GenderHealthCare.model.User;
import com.GenderHealthCare.repository.RoleRepository;
import com.GenderHealthCare.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public User processOAuthPostLogin(String email, String name, String imageUrl) {
        Optional<User> existUser = userRepository.findByEmail(email);

        if (existUser.isPresent()) {
            return existUser.get();
        }

        // Nếu chưa có, tạo user mới
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setImageUrl(imageUrl);

        // Gán role mặc định, ví dụ Role CUSTOMER
        Role customerRole = roleRepository.findByName(RoleName.CUSTOMER)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(RoleName.CUSTOMER);
                    newRole.setDisplayName("Khach hang");
                    return roleRepository.save(newRole);
                });
        newUser.setRole(customerRole);

        newUser.setActive(true);
        // Mật khẩu có thể null hoặc đặt giá trị mặc định (do login bằng google)
        newUser.setPasswordHash(null);

        return userRepository.save(newUser);
    }
}
