package com.ghsms.service;

import com.ghsms.file_enum.RoleName;
import com.ghsms.model.Role;
import com.ghsms.model.User;
import com.ghsms.repository.RoleRepository;
import com.ghsms.repository.UserRepository;
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
                    return roleRepository.save(newRole);
                });
        newUser.setRole(customerRole);

        newUser.setActive(true);
        // Mật khẩu có thể null hoặc đặt giá trị mặc định (do login bằng google)
        newUser.setPasswordHash(null);

        return userRepository.save(newUser);
    }
}
