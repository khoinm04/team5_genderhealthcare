package com.ghsms.repository;

import com.ghsms.model.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Optional<Consultation> findByBooking_BookingId(Long bookingId);

    List<Consultation> findByCustomerCustomerUserIdOrderByDateScheduledDesc(Long customerId);

    // Lấy danh sách consultation của consultant
    List<Consultation> findByConsultantConsultantUserIdOrderByDateScheduledDesc(Long consultantId);

    @Query("SELECT c FROM Consultation c " +
            "WHERE c.consultant.consultant.userId = :consultantId " +  // chỉ dùng 1 lần consultant
            "AND c.status = 'COMPLETED' " +
            "AND c.endTime IS NOT NULL " +                  // tránh lỗi nếu endTime null
            "AND FUNCTION('DATE', c.endTime) = CURRENT_DATE")
    List<Consultation> findTodayCompletedByConsultant(@Param("consultantId") Long consultantId);

    @Query("""
                SELECT c 
                FROM Consultation c 
                JOIN FETCH c.consultant cd 
                JOIN FETCH cd.consultant u 
                WHERE c.consultationId = :id
            """)
    Optional<Consultation> findWithConsultantById(@Param("id") Long id);

    @Modifying
    @Query("UPDATE Consultation c SET c.note = :note WHERE c.consultationId = :id")
    void updateNoteById(@Param("id") Long id, @Param("note") String note);


}
