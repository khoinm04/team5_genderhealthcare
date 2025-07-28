package com.ghsms.repository;

import com.ghsms.model.MenstrualCycleHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MenstrualCycleHistoryRepository extends JpaRepository<MenstrualCycleHistory, Long> {
    List<MenstrualCycleHistory> findByUserUserIdOrderByStartDateDesc(Long userId);
}
