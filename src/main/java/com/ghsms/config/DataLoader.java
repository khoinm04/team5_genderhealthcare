package com.ghsms.config;

    import com.ghsms.model.Role;
    import com.ghsms.model.RoleType;
    import com.ghsms.repository.RoleRepository;
    import org.springframework.boot.CommandLineRunner;
    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;

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
    }