package com.ghsms.config;

import com.ghsms.file_enum.AuthProvider;
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
import com.ghsms.model.Services;

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
                        .authProvider(AuthProvider.LOCAL)
                        .build();

                userRepository.save(adminUser);
            }
        };
    }

    @Bean
    CommandLineRunner loadServices(ServiceRepository serviceRepo) {
        return args -> {
            if (serviceRepo.count() == 0) {
                Services generalConsultation = new Services();
                generalConsultation.setServiceName("Tư vấn tổng quát");
                generalConsultation.setCategory(ServiceBookingCategory.GENERAL_CONSULTATION);
                generalConsultation.setPrice(new BigDecimal("200000.00"));
                generalConsultation.setDescription("Khám sức khỏe định kỳ và tư vấn");
                generalConsultation.setDuration("30 phút");
                serviceRepo.save(generalConsultation);

                Services specialistConsultation = new Services();
                specialistConsultation.setServiceName("Tư vấn chuyên khoa");
                specialistConsultation.setCategory(ServiceBookingCategory.SPECIALIST_CONSULTATION);
                specialistConsultation.setPrice(new BigDecimal("250000.00"));
                specialistConsultation.setDescription("Tư vấn với bác sĩ chuyên khoa");
                specialistConsultation.setDuration("20 phút");
                serviceRepo.save(specialistConsultation);

                Services reExamination = new Services();
                reExamination.setServiceName("Tái khám");
                reExamination.setCategory(ServiceBookingCategory.RE_EXAMINATION);
                reExamination.setPrice(new BigDecimal("300000.00"));
                reExamination.setDescription("Tư vấn tái khám");
                reExamination.setDuration("25 phút");
                serviceRepo.save(reExamination);

                Services emergencyConsultation = new Services();
                emergencyConsultation.setServiceName("Tư vấn khẩn cấp");
                emergencyConsultation.setCategory(ServiceBookingCategory.EMERGENCY_CONSULTATION);
                emergencyConsultation.setPrice(new BigDecimal("150000.00"));
                emergencyConsultation.setDescription("Tư vấn y tế khẩn cấp");
                emergencyConsultation.setDuration("25 phút");
                serviceRepo.save(emergencyConsultation);

                Services hivTest = new Services();
                hivTest.setServiceName("Xét nghiệm HIV");
                hivTest.setCategory(ServiceBookingCategory.STI_HIV);
                hivTest.setPrice(new BigDecimal("200000.00"));
                hivTest.setDescription("Phát hiện virus gây suy giảm miễn dịch mắc phải");
                hivTest.setPreparation("Không cần nhịn ăn");
                hivTest.setDuration("30 phút");
                serviceRepo.save(hivTest);

                Services syphilisTest = new Services();
                syphilisTest.setServiceName("Xét nghiệm giang mai (Syphilis)");
                syphilisTest.setCategory(ServiceBookingCategory.STI_Syphilis);
                syphilisTest.setPrice(new BigDecimal("150000.00"));
                syphilisTest.setDescription("Phát hiện vi khuẩn Treponema pallidum");
                syphilisTest.setPreparation("Không cần nhịn ăn");
                syphilisTest.setDuration("20 phút");
                serviceRepo.save(syphilisTest);

                Services gonorrheaTest = new Services();
                gonorrheaTest.setServiceName("Xét nghiệm lậu (Gonorrhea)");
                gonorrheaTest.setCategory(ServiceBookingCategory.STI_Gonorrhea);
                gonorrheaTest.setPrice(new BigDecimal("180000.00"));
                gonorrheaTest.setDescription("Phát hiện vi khuẩn Neisseria gonorrhoeae");
                gonorrheaTest.setPreparation("Không quan hệ tình dục 24h trước xét nghiệm");
                gonorrheaTest.setDuration("25 phút");
                serviceRepo.save(gonorrheaTest);

                Services chlamydiaTest = new Services();
                chlamydiaTest.setServiceName("Xét nghiệm Chlamydia");
                chlamydiaTest.setCategory(ServiceBookingCategory.STI_Chlamydia);
                chlamydiaTest.setPrice(new BigDecimal("170000.00"));
                chlamydiaTest.setDescription("Phát hiện vi khuẩn Chlamydia trachomatis");
                chlamydiaTest.setPreparation("Không quan hệ tình dục 24h trước xét nghiệm");
                chlamydiaTest.setDuration("25 phút");
                serviceRepo.save(chlamydiaTest);
            }
        };
    }
}