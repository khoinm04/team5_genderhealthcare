package com.ghsms.repository;

import com.ghsms.file_enum.ServiceCategoryType;
import com.ghsms.model.Services;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ServiceRepository extends JpaRepository<Services, Long> {
    long countByActiveTrue();

    List<Services> findByCategoryTypeAndActive(ServiceCategoryType type, boolean isActive);
    List<Services> findByCategoryType(ServiceCategoryType category);



}