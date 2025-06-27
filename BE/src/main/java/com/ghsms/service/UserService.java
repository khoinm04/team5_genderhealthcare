package com.ghsms.service;

import com.ghsms.DTO.UserDTO;
import com.ghsms.file_enum.RoleName;
import com.ghsms.model.User;
import com.ghsms.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.ghsms.mapper.UserMapper;

import java.util.Collection;
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


    public User createUser(User user) {
        // Encode password before saving
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
        return userRepository.findByIsActiveTrue();
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

}