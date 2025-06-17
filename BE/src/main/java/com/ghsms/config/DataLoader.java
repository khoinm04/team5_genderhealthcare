package com.ghsms.config;

import com.ghsms.file_enum.ServiceBookingCategory;
import com.ghsms.model.Role;
import com.ghsms.model.User;
import com.ghsms.file_enum.RoleName;
import com.ghsms.repository.RoleRepository;
import com.ghsms.repository.ServiceRepository;
import com.ghsms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.ghsms.model.Service;

import java.math.BigDecimal;
import java.util.Optional;

@Configuration
@RequiredArgsConstructor
public class DataLoader {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initDatabase(RoleRepository roleRepository, UserRepository userRepository) {
        return args -> {
            // Initialize roles if they don't exist
            if (roleRepository.count() == 0) {
                roleRepository.save(new Role(RoleName.ROLE_ADMIN, "Admin"));
                roleRepository.save(new Role(RoleName.ROLE_MANAGER, "Manager"));
                roleRepository.save(new Role(RoleName.ROLE_STAFF, "Staff"));
                roleRepository.save(new Role(RoleName.ROLE_CONSULTANT, "Consultant"));
                roleRepository.save(new Role(RoleName.ROLE_CUSTOMER, "Customer"));
            }

            // Create admin user if it doesn't exist
            // Store the Optional result in a variable first to avoid ResultSet closing issues
            Optional<User> existingAdmin = userRepository.findByEmail("admin@ghsms.com");
            if (existingAdmin.isEmpty()) {
                Role adminRole = roleRepository.findByName(RoleName.ROLE_ADMIN)
                        .orElseThrow(() -> new RuntimeException("Admin role not found"));

                User adminUser = User.builder()
                        .email("admin@ghsms.com")
                        .passwordHash(passwordEncoder.encode("admin123"))
                        .name("System Administrator")
                        .role(adminRole)
                        .isActive(true)
                        .build();

                userRepository.save(adminUser);
            }
        };
    }

    @Bean
    CommandLineRunner loadServices(ServiceRepository serviceRepo) {
        return args -> {
            if (serviceRepo.count() == 0) {
                Service generalConsultation = new Service();
                generalConsultation.setServiceName("General Consultation");
                generalConsultation.setCategory(ServiceBookingCategory.GENERAL_CONSULTATION);
                generalConsultation.setPrice(new BigDecimal("50.00"));
                generalConsultation.setDescription("Regular health checkup and consultation");
                serviceRepo.save(generalConsultation);

                Service specialistConsultation = new Service();
                specialistConsultation.setServiceName("Specialist Consultation");
                specialistConsultation.setCategory(ServiceBookingCategory.SPECIALIST_CONSULTATION);
                specialistConsultation.setPrice(new BigDecimal("100.00"));
                specialistConsultation.setDescription("Consultation with specialist doctor");
                serviceRepo.save(specialistConsultation);

                Service reExamination = new Service();
                reExamination.setServiceName("Re-examination");
                reExamination.setCategory(ServiceBookingCategory.RE_EXAMINATION);
                reExamination.setPrice(new BigDecimal("30.00"));
                reExamination.setDescription("Follow-up consultation");
                serviceRepo.save(reExamination);

                Service emergencyConsultation = new Service();
                emergencyConsultation.setServiceName("Emergency Consultation");
                emergencyConsultation.setCategory(ServiceBookingCategory.EMERGENCY_CONSULTATION);
                emergencyConsultation.setPrice(new BigDecimal("150.00"));
                emergencyConsultation.setDescription("Urgent medical consultation");
                serviceRepo.save(emergencyConsultation);
            }
        };
    }
}