package com.ghsms.config;

import com.ghsms.file_enum.BookingStatus;
import com.ghsms.model.Booking;
import com.ghsms.model.Role;
import com.ghsms.file_enum.RoleType;
import com.ghsms.model.Service;
import com.ghsms.model.User;
import com.ghsms.repository.*;
import com.ghsms.repository.ServiceRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDate;
import java.util.Optional;

@Configuration
public class DataLoader {

    @Bean
    CommandLineRunner initDatabase(RoleRepository roleRepository) {
        return args -> {
            if (roleRepository.count() == 0) {
                roleRepository.save(new Role(RoleType.ADMIN, "Admin"));
                roleRepository.save(new Role(RoleType.MANAGER, "Manager"));
                roleRepository.save(new Role(RoleType.STAFF, "Staff"));
                roleRepository.save(new Role(RoleType.CONSULTANT, "Consultant"));
                roleRepository.save(new Role(RoleType.CUSTOMER, "Customer"));
            }
        };
    }

    @Bean
    CommandLineRunner loadData(BookingRepository bookingRepo, UserRepository userRepo, ServiceRepository serviceRepo) {
        return args -> {
            Optional<User> userOpt = userRepo.findById(1L);
            Optional<Service> serviceOpt = serviceRepo.findById(1L);

            if (userOpt.isPresent() && serviceOpt.isPresent()) {
                User user = userOpt.get();
                Service service = serviceOpt.get();

                bookingRepo.save(new Booking(null, user, service, LocalDate.now(), "09:00-10:00", BookingStatus.CONFIRMED, null));
                bookingRepo.save(new Booking(null, user, service, LocalDate.now(), "10:00-11:00", BookingStatus.COMPLETED, null));
                bookingRepo.save(new Booking(null, user, service, LocalDate.now(), "11:00-12:00", BookingStatus.CANCELED, null));
            } else {
                System.out.println("Thiếu user hoặc service trong database. Không thể tạo booking mẫu.");
            }
        };
    }
}