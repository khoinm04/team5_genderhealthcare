package com.ghsms.repository;

import com.ghsms.model.CustomerDetails;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CustomerDetailsRepository extends JpaRepository<CustomerDetails, Long> {
}
