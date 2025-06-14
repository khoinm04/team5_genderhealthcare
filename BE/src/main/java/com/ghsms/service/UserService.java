package com.ghsms.service;

import com.ghsms.model.User;
import com.ghsms.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User createUser(User user) {
        // Encode password before saving
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        return userRepository.save(user);
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
    public List<User> getAllUsers(){
        return userRepository.findAll();
    }

//    public User updateUser(Long userId, User updatedUser) {
//        User existingUser = userRepository.findById(userId)
//                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
//
//        // Update only the fields that are provided
//        if (updatedUser.getName() != null) {
//            existingUser.setName(updatedUser.getName());
//        }
//        if (updatedUser.getEmail() != null) {
//            existingUser.setEmail(updatedUser.getEmail());
//        }
//        if (updatedUser.getRole() != null) {
//            existingUser.setRole(updatedUser.getRole());
//        }
//
//        // Handle boolean field differently since it's primitive
//        existingUser.setActive(updatedUser.isActive());
//
//        // Save the updated user
//        return userRepository.save(existingUser);
//    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }


    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        // Optional: Add additional checks before deletion
        if (!user.getIsActive()) {
            throw new RuntimeException("User is already inactive");
        }

        userRepository.delete(user);
    }
}