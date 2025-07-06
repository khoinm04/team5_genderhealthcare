package com.ghsms.repository;

import com.ghsms.file_enum.ServiceBookingCategory;
import com.ghsms.model.Services;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ServiceRepository extends JpaRepository<Services, Long> {
    long countByActiveTrue();

}