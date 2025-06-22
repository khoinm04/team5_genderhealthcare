package com.ghsms.repository;

import com.ghsms.model.ConsultantDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ConsultantDetailsRepository extends JpaRepository<ConsultantDetails, Long> {
    // This interface extends StaffDetailsRepository to inherit its methods.
    // Additional methods specific to ConsultantDetails can be added here if needed.
    @Query("SELECT c FROM ConsultantDetails c WHERE c.consultant.userId = :userId AND c.consultant.isActive = :isActive")
    Optional<ConsultantDetails> findByConsultantUserIdAndActive(@Param("userId") Long userId,
                                                                @Param("isActive") Boolean isActive);
}

