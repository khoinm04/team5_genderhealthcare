package com.ghsms.repository;

import com.ghsms.file_enum.ConsultationStatus;
import com.ghsms.model.Consultation;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Optional<Consultation> findByBooking_BookingId(Long bookingId);
    List<Consultation> findByCustomerCustomerUserIdOrderByDateScheduledDesc(Long customerId);

    Page<Consultation> findByConsultantConsultantUserIdOrderByDateScheduledDesc(Long consultantId, Pageable pageable);

    @Query("""
    SELECT c FROM Consultation c
    WHERE c.consultant.consultant.userId = :consultantId
      AND c.status = 'COMPLETED'
      AND c.endTime IS NOT NULL
      AND c.endTime BETWEEN :startOfDay AND :endOfDay
    """)
    List<Consultation> findTodayCompletedByConsultant(
            @Param("consultantId") Long consultantId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );


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

    @Query("""
    SELECT COUNT(c) FROM Consultation c
    WHERE c.booking.bookingDate = :bookingDate
      AND c.booking.timeSlot = :timeSlot
      AND c.status != :canceledStatus
""")
    int countActiveConsultationsByDateAndSlot(
            @Param("bookingDate") String bookingDate,
            @Param("timeSlot") String timeSlot,
            @Param("canceledStatus") ConsultationStatus canceledStatus
    );

    long countByStatus(ConsultationStatus status);


}
