package com.ghsms.service;

import com.ghsms.file_enum.AuthProvider;
import com.ghsms.file_enum.RoleName;
import com.ghsms.model.Role;
import com.ghsms.model.User;
import com.ghsms.repository.RoleRepository;
import com.ghsms.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    @Transactional
    public User processOAuthPostLogin(Long userId, String email, String name, String imageUrl) {
        Optional<User> existUserOpt = userRepository.findByEmail(email);

        if (existUserOpt.isPresent()) {
            User existUser = existUserOpt.get();

            // ⚠️ Nếu user đăng ký bằng LOCAL mà dùng Google login thì từ chối
            if (existUser.getAuthProvider() != AuthProvider.GOOGLE) {
                throw new RuntimeException("Tài khoản đã tồn tại và không được đăng nhập bằng Google");
            }

            // ✅ Cập nhật lại name và imageUrl nếu có sự thay đổi
            boolean changed = false;

            if (name != null && !name.equals(existUser.getName())) {
                existUser.setName(name);
                changed = true;
            }

            if (imageUrl != null && !imageUrl.equals(existUser.getImageUrl())) {
                existUser.setImageUrl(imageUrl);
                changed = true;
            }

            if (changed) {
                return userRepository.save(existUser);
            }

            return existUser;
        }

        // Nếu chưa có, tạo user mới
        User newUser = new User();
        newUser.setUserId(userId); // Nếu dùng auto increment thì bỏ dòng này
        newUser.setEmail(email);
        newUser.setName(name);
        newUser.setImageUrl(imageUrl);
        newUser.setIsActive(true);
        newUser.setPasswordHash(null); // Google không có mật khẩu
        newUser.setAuthProvider(AuthProvider.GOOGLE);

        Role customerRole = roleRepository.findByName(RoleName.ROLE_CUSTOMER)
                .orElseGet(() -> {
                    Role newRole = new Role();
                    newRole.setName(RoleName.ROLE_CUSTOMER);
                    return roleRepository.save(newRole);
                });

        newUser.setRole(customerRole);

        return userRepository.save(newUser);
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }
}
