package com.ghsms.repository;

import com.ghsms.model.ContraceptiveSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ContraceptiveScheduleRepository extends JpaRepository<ContraceptiveSchedule, Long> {
    List<ContraceptiveSchedule> findByIsActiveTrue();
    List<ContraceptiveSchedule> findByUserUserIdAndIsActiveTrue(Long userId);
}
