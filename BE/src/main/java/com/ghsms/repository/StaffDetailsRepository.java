package com.ghsms.repository;

import com.ghsms.file_enum.Is_Active;
import com.ghsms.model.StaffDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface StaffDetailsRepository extends JpaRepository<StaffDetails, Long> {

    @Query("SELECT s FROM StaffDetails s WHERE s.staff.userId = :userId AND s.staff.isActive = :isActive")
    Optional<StaffDetails> findByStaffUserIdAndActive(@Param("userId") Long userId,
                                                      @Param("isActive") Boolean isActive);
}

