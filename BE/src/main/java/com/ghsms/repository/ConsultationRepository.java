package com.ghsms.repository;

import com.ghsms.model.Consultation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    Optional<Consultation> findByBooking_BookingId(Long bookingId);
    List<Consultation> findByCustomerCustomerUserIdOrderByDateScheduledDesc(Long customerId);

    // Lấy danh sách consultation của consultant
    List<Consultation> findByConsultantConsultantUserIdOrderByDateScheduledDesc(Long consultantId);
}
