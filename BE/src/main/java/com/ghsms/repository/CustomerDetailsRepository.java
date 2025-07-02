package com.ghsms.repository;

import com.ghsms.model.Booking;
import com.ghsms.model.CustomerDetails;
import com.ghsms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CustomerDetailsRepository extends JpaRepository<CustomerDetails, Long> {
    Optional<CustomerDetails> findByCustomer(User customer);


}

