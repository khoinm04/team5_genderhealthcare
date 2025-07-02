package com.ghsms.service;

import com.ghsms.DTO.CreateUserRequest;
import com.ghsms.DTO.UserDTO;
import com.ghsms.file_enum.AuthProvider;
import com.ghsms.file_enum.CertificateStatus;
import com.ghsms.file_enum.RoleName;
import com.ghsms.model.*;
import com.ghsms.repository.ConsultantDetailsRepository;
import com.ghsms.repository.RoleRepository;
import com.ghsms.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.hibernate.validator.internal.util.stereotypes.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ghsms.mapper.UserMapper;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;
    private final RoleRepository roleRepository;
    private final ConsultantDetailsRepository consultantDetailsRepository;



    public void createUserByAdmin(CreateUserRequest req) {
        if (userRepository.existsByEmail(req.getEmail())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email đã tồn tại");
        }

        Role role = roleRepository.findByName(convertRoleName(req.getRole()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Vai trò không tồn tại"));

        User user = User.builder()
                .name(req.getName())
                .email(req.getEmail())
                .passwordHash(passwordEncoder.encode(req.getPassword()))
                .phoneNumber(req.getPhoneNumber())
                .role(role)
                .isActive(true)
                .authProvider(AuthProvider.LOCAL)
                .build();

        userRepository.save(user);

        // Nếu là tư vấn viên thì tạo ConsultantDetails
        if (RoleName.ROLE_CONSULTANT.name().equals(role.getName().name())) {
            ConsultantDetails details = new ConsultantDetails();
            details.setConsultant(user);

            // ❗ Giao cho manager gán sau
            details.setSpecialization(null);
            details.setHireDate(null);
            details.setYearsOfExperience(null);

            if (req.getCertificates() != null && !req.getCertificates().isEmpty()) {
                Set<Certificate> certs = req.getCertificates().stream()
                        .map(certName -> {
                            Certificate cert = new Certificate();
                            cert.setName(certName);
                            cert.setStatus(CertificateStatus.APPROVED);
                            cert.setConsultant(details);
                            return cert;
                        })
                        .collect(Collectors.toSet());
                details.setCertificates(certs);
            }

            consultantDetailsRepository.save(details);
        }

    }


    private RoleName convertRoleName(String roleText) {
        return switch (roleText.trim()) {
            case "Khách hàng" -> RoleName.ROLE_CUSTOMER;
            case "Tư vấn viên" -> RoleName.ROLE_CONSULTANT;
            case "Nhân viên" -> RoleName.ROLE_STAFF;
            case "Quản lý" -> RoleName.ROLE_MANAGER;
            case "Quản trị viên" -> RoleName.ROLE_ADMIN;
            default -> throw new IllegalArgumentException("Vai trò không hợp lệ: " + roleText);
        };
    }


    public User createUser(User user) {
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
    }

    // Trong UserService.java
    public List<User> getUsersByIds(Set<Long> userIds) {
        return userRepository.findAllById(userIds);
    }



    public User getUserById(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
    }
    public Optional<User> findOptionalById(Long userId) {
        return userRepository.findById(userId);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
    }

    public boolean checkAdminCredentials(String email, String password) {
        return userRepository.findByEmail(email)
                .map(user -> passwordEncoder.matches(password, user.getPasswordHash()))
                .orElse(false);
    }

    public Optional<User> findByName(String name) {
        return userRepository.findByEmail(name);
    }
    public boolean existsByEmail(String email) {
        return userRepository.findByEmail(email).isPresent();
    }

    public Optional<User> findOptionalByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        // If the password hash is different from what's in the database,
        // it means it's a new plain password that needs encoding
        Optional<User> existingUser = userRepository.findById(user.getUserId());

        // Check if both password hashes exist before comparing them
        if (existingUser.isPresent() &&
                existingUser.get().getPasswordHash() != null &&
                user.getPasswordHash() != null &&
                !existingUser.get().getPasswordHash().equals(user.getPasswordHash())) {
            user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        }

        return userRepository.save(user);
    }

    //Các chức năng dành cho admin
    public List<User> getAllActiveUsers(){
        return userRepository.findAll();
    }


    public User updateUser(User user) {
        return userRepository.save(user);
    }


    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        if (!user.getIsActive()) {
            throw new RuntimeException("User is already inactive");
        }

        user.setIsActive(false); // hoặc user.setActive(false); tùy theo tên trường
        userRepository.save(user);
    }

    public List<User> findByRoleName(RoleName roleName) {
        return userRepository.findByRole_Name(roleName);
    }

    public long countByRoleName(RoleName roleName) {
        return userRepository.countByRole_Name(roleName);
    }

    //de chinh sua profile
    public UserDTO updateProfile(Long userId, UserDTO updateData) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(updateData.getName());
        user.setPhoneNumber(updateData.getPhoneNumber());

        return new UserDTO(userRepository.save(user));
    }

    public void changePassword(Long userId, String currentPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (user.getAuthProvider() == AuthProvider.GOOGLE) {
            throw new IllegalStateException("Tài khoản Google không thể đổi mật khẩu.");
        }

        if (!passwordEncoder.matches(currentPassword, user.getPasswordHash())) {
            throw new IllegalArgumentException("Mật khẩu hiện tại không đúng.");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public Optional<User> findById(Long customerId){
        return userRepository.findById(customerId);
    }
}