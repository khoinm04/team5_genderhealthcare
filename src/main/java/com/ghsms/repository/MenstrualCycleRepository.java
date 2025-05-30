package com.ghsms.repository;

import com.ghsms.model.MenstrualCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface MenstrualCycleRepository extends JpaRepository<MenstrualCycle, Long> {
    List<MenstrualCycle> findByCustomerUserIdOrderByStartDateDesc(Long customerId);
    List<MenstrualCycle> findByNextPredictedDateEquals(LocalDate date);
}
