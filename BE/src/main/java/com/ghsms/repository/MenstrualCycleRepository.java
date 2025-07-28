package com.ghsms.repository;

import com.ghsms.model.MenstrualCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface MenstrualCycleRepository extends JpaRepository<MenstrualCycle, Long> {
    Optional<MenstrualCycle> findByCustomer_userId(Long customerId);

    List<MenstrualCycle> findByNextPredictedDateEquals(LocalDate date);

    List<MenstrualCycle> findByPredictedOvulationDateEquals(LocalDate date);

    List<MenstrualCycle> findByPredictedFertileWindowStartDateEquals(LocalDate date);

    List<MenstrualCycle> findByPredictedFertileWindowEndDateEquals(LocalDate date);

}