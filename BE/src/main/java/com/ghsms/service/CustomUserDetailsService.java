package com.ghsms.service;

import com.ghsms.DTO.UserInfoDTO;
import com.ghsms.model.CustomerDetails;
import com.ghsms.model.User;
import com.ghsms.repository.CustomerDetailsRepository;
import com.ghsms.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final CustomerDetailsRepository customerDetailsRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        log.debug("Attempting to load user with email: {}", email);

        if (email == null || email.trim().isEmpty()) {
            log.error("Email is empty or null");
            throw new UsernameNotFoundException("Email cannot be empty");
        }

        User user = userRepository.findByEmail(email.trim())
                .orElseThrow(() -> {
                    log.error("User not found with email: {}", email);
                    return new UsernameNotFoundException("User not found with email: " + email);
                });

        log.debug("Found user: {}", user.getEmail());

        return org.springframework.security.core.userdetails.User.builder()
                .username(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(new SimpleGrantedAuthority(user.getRole().getName().toString()))
                .build();
    }

    public Optional<CustomerDetails> findByCustomer(User user) {
        return customerDetailsRepository.findByCustomer(user);
    }

    public void updateCustomerDetails(Long userId, UserInfoDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));

        CustomerDetails details = customerDetailsRepository.findByCustomer(user)
                .orElseGet(() -> new CustomerDetails()); // nếu chưa có thì tạo mới

        details.setCustomer(user);
        details.setFullName(dto.getFullName());
        details.setPhoneNumber(dto.getPhone());
        details.setAge(dto.getAge());
        details.setGender(dto.getGender());
        details.setEmail(dto.getEmail());

        customerDetailsRepository.save(details);
    }

}