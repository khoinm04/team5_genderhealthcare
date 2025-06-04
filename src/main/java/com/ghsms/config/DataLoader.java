package com.ghsms.config;

import com.ghsms.file_enum.BookingStatus;
import com.ghsms.file_enum.ServiceBookingCategory;
import com.ghsms.model.Booking;
import com.ghsms.model.Role;
import com.ghsms.file_enum.RoleName;
import com.ghsms.model.Service;
import com.ghsms.model.User;
import com.ghsms.repository.*;
import com.ghsms.repository.ServiceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Optional;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.count() == 0) {
                roleRepository.save(new Role(RoleName.ADMIN, "Admin"));
                roleRepository.save(new Role(RoleName.MANAGER, "Manager"));
                roleRepository.save(new Role(RoleName.STAFF, "Staff"));
                roleRepository.save(new Role(RoleName.CONSULTANT, "Consultant"));
                roleRepository.save(new Role(RoleName.CUSTOMER, "Customer"));
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