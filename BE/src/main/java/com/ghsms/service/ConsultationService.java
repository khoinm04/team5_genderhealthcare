package com.ghsms.service;

import com.ghsms.DTO.ConsultationDTO;
import com.ghsms.DTO.ConsultationNoteStatusUpdateDTO;
import com.ghsms.file_enum.ConsultationStatus;
import com.ghsms.file_enum.RoleName;
import com.ghsms.file_enum.ServiceCategoryType;
import com.ghsms.model.Consultation;
import com.ghsms.model.Services;
import com.ghsms.model.User;
import com.ghsms.repository.ConsultationRepository;
import com.ghsms.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final UserRepository userRepository;

    /**
     * 1. API lấy tất cả lịch hẹn của customer
     */
    public List<ConsultationDTO> getAllCustomerConsultations(Long customerId) {
        // Kiểm tra customer có tồn tại không
        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + customerId));

        // Lấy tất cả consultation của customer (không phân biệt status)
        List<Consultation> consultations = consultationRepository
                .findByCustomerCustomerUserIdOrderByDateScheduledDesc(customerId);

        log.info("Tìm thấy {} consultation cho customer {}", consultations.size(), customerId);

        return consultations.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * 2. API lấy tất cả lịch hẹn của consultant
     */
    public List<ConsultationDTO> getAllConsultantConsultations(Long consultantId) {
        // Kiểm tra consultant có tồn tại không
        User consultant = userRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tư vấn viên với ID: " + consultantId));

        // Kiểm tra role consultant
        if (!consultant.getRole().getName().equals(RoleName.ROLE_CONSULTANT)) {
            throw new RuntimeException("User không phải là tư vấn viên");
        }

        // Lấy tất cả consultation của consultant
        List<Consultation> consultations = consultationRepository
                .findByConsultantConsultantUserIdOrderByDateScheduledDesc(consultantId);

        log.info("Tìm thấy {} consultation cho consultant {}", consultations.size(), consultantId);

        return consultations.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * 3. API chỉnh sửa note và status của Consultant - CẬP NHẬT
     */
    @Transactional
    public ConsultationDTO updateConsultantNoteAndStatus(Long consultationId, ConsultationNoteStatusUpdateDTO dto, Long consultantId) {
        // Tìm consultation
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy consultation với ID: " + consultationId));

        // Kiểm tra quyền sở hữu
        if (!consultation.getConsultant().getConsultant().getUserId().equals(consultantId)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa consultation này");
        }

        // Cập nhật note nếu có
        if (dto.getNote() != null && !dto.getNote().trim().isEmpty()) {
            consultation.setNote(dto.getNote().trim());
        }

        // Cập nhật status nếu có
        if (dto.getStatus() != null) {
            consultation.setStatus(dto.getStatus());
        }

        // Lưu lại
        Consultation savedConsultation = consultationRepository.save(consultation);

        log.info("Consultant {} đã cập nhật consultation {}: note={}, status={}",
                consultantId, consultationId,
                dto.getNote() != null, dto.getStatus());

        return toDTO(savedConsultation);
    }

    // lay thong ke cho consultant


    /**
     * 4. API chỉnh sửa rating và feedback của Customer - CẬP NHẬT
     */
    @Transactional
    public ConsultationDTO updateCustomerRatingAndFeedback(ConsultationDTO consultationDTO, Long customerId) {
        // Tìm consultation
        Consultation consultation = consultationRepository.findById(consultationDTO.getConsultationId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy consultation với ID: " + consultationDTO.getConsultationId()));

        // Kiểm tra quyền sở hữu
        if (!consultation.getCustomer().getCustomer().getUserId().equals(customerId)) {
            throw new RuntimeException("Bạn không có quyền đánh giá consultation này");
        }

        // Kiểm tra consultation đã hoàn thành chưa
        if (consultation.getStatus() != ConsultationStatus.COMPLETED) {
            throw new RuntimeException("Chỉ có thể đánh giá consultation đã hoàn thành");
        }

        // Validation rating
        if (consultationDTO.getRating() != null && (consultationDTO.getRating() < 1 || consultationDTO.getRating() > 5)) {
            throw new RuntimeException("Đánh giá phải từ 1 đến 5 sao");
        }

        // Cập nhật rating và feedback
        if (consultationDTO.getRating() != null) {
            consultation.setRating(consultationDTO.getRating());
        }
        if (consultationDTO.getFeedback() != null) {
            consultation.setFeedback(consultationDTO.getFeedback().trim());
        }

        Consultation savedConsultation = consultationRepository.save(consultation);

        log.info("Customer {} đã đánh giá consultation {}: rating={}, feedback={}",
                customerId, consultationDTO.getConsultationId(),
                consultationDTO.getRating(), consultationDTO.getFeedback() != null);

        return toDTO(savedConsultation);
    }

    /**
     * 5. API chỉnh sửa TimeSlot của Staff - CẬP NHẬT
     */
    @Transactional
    public ConsultationDTO updateTimeSlotByStaff(ConsultationDTO consultationDTO) {
        // Tìm consultation
        Consultation consultation = consultationRepository.findById(consultationDTO.getConsultationId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy consultation với ID: " + consultationDTO.getConsultationId()));

        // Kiểm tra consultation có thể chỉnh sửa không
        if (consultation.getStatus() == ConsultationStatus.COMPLETED ||
                consultation.getStatus() == ConsultationStatus.CANCELED) {
            throw new RuntimeException("Không thể chỉnh sửa time slot của consultation đã hoàn thành hoặc đã hủy");
        }

        // Validation time slot format
        String timeSlot = consultationDTO.getTimeSlot();
        if (timeSlot != null && !timeSlot.matches("^\\d{2}:\\d{2}-\\d{2}:\\d{2}$")) {
            throw new RuntimeException("Time slot phải đúng định dạng HH:mm-HH:mm (ví dụ: 10:00-11:00)");
        }


        // Cập nhật time slot
        consultation.setTimeSlot(timeSlot);

        Consultation savedConsultation = consultationRepository.save(consultation);

        log.info("Staff đã cập nhật time slot cho consultation {}: {}",
                consultationDTO.getConsultationId(), timeSlot);

        return toDTO(savedConsultation);
    }

    /**
     * 6. API chỉnh sửa Status của Staff - CẬP NHẬT (XÓA REASON)
     */
    @Transactional
    public ConsultationDTO updateStatusByStaff(ConsultationDTO consultationDTO) {
        // Tìm consultation
        Consultation consultation = consultationRepository.findById(consultationDTO.getConsultationId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy consultation với ID: " + consultationDTO.getConsultationId()));

        // Kiểm tra trạng thái có thể chuyển đổi không (nếu có logic canTransitionTo)
        ConsultationStatus newStatus = consultationDTO.getStatus();
        ConsultationStatus oldStatus = consultation.getStatus();


        // ✅ CẬP NHẬT: Chỉ cập nhật status
        consultation.setStatus(newStatus);

        Consultation savedConsultation = consultationRepository.save(consultation);

        log.info("Staff đã cập nhật status cho consultation {} từ {} sang {}",
                consultationDTO.getConsultationId(), oldStatus, newStatus);

        return toDTO(savedConsultation);
    }

    /**
     * 7.API lấy tất cả consultation cho Manager
     * Manager có thể xem tất cả consultation trong hệ thống
     */
    public List<ConsultationDTO> getAllConsultationsForManager() {
        log.info("Manager đang lấy tất cả consultation trong hệ thống");

        // Lấy tất cả consultation từ database
        List<Consultation> allConsultations = consultationRepository.findAll();

        // Sắp xếp theo thời gian tạo mới nhất
        allConsultations.sort((c1, c2) -> {
            if (c1.getUpdatedAt() != null && c2.getUpdatedAt() != null) {
                return c2.getUpdatedAt().compareTo(c1.getUpdatedAt());
            }
            return c2.getConsultationId().compareTo(c1.getConsultationId());
        });

        log.info("Tìm thấy {} consultation trong hệ thống", allConsultations.size());

        // Convert sang DTO
        return allConsultations.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * API lấy consultation theo status cho Manager
     */
    /*
    public List<ConsultationDTO> getConsultationsByStatusForManager(ConsultationStatus status) {
        log.info("Manager đang lấy consultation với status: {}", status);

        List<Consultation> consultations = consultationRepository.findByStatusOrderByDateScheduledAsc(status);

        log.info("Tìm thấy {} consultation với status {}", consultations.size(), status);

        return consultations.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }
    */

    /**
     * API lấy thống kê consultation cho Manager
     */
    /*
    public Map<String, Object> getConsultationStatisticsForManager() {
        log.info("Manager đang lấy thống kê consultation");

        List<Consultation> allConsultations = consultationRepository.findAll();

        // Thống kê theo status
        Map<ConsultationStatus, Long> statusStats = allConsultations.stream()
                .collect(Collectors.groupingBy(
                        Consultation::getStatus,
                        Collectors.counting()
                ));

        // Thống kê theo consultant
        Map<String, Long> consultantStats = allConsultations.stream()
                .collect(Collectors.groupingBy(
                        consultation -> consultation.getConsultant().getName(),
                        Collectors.counting()
                ));

        // Thống kê rating trung bình
        double averageRating = allConsultations.stream()
                .filter(c -> c.getRating() != null)
                .mapToInt(Consultation::getRating)
                .average()
                .orElse(0.0);

        // Tổng số consultation
        long totalConsultations = allConsultations.size();

        // Consultation hoàn thành
        long completedConsultations = allConsultations.stream()
                .filter(c -> c.getStatus() == ConsultationStatus.COMPLETED)
                .count();

        Map<String, Object> statistics = Map.of(
                "totalConsultations", totalConsultations,
                "completedConsultations", completedConsultations,
                "averageRating", Math.round(averageRating * 100.0) / 100.0,
                "statusStatistics", statusStats,
                "consultantStatistics", consultantStats,
                "completionRate", totalConsultations > 0 ?
                        Math.round((double) completedConsultations / totalConsultations * 100.0) / 100.0 : 0.0
        );

        log.info("Thống kê consultation: Total={}, Completed={}, Average Rating={}",
                totalConsultations, completedConsultations, averageRating);

        return statistics;
    }
    */


    /**
     * Cập nhật method toDTO để bao gồm tất cả field mới
     */
    private ConsultationDTO toDTO(Consultation consultation) {
        ConsultationDTO dto = new ConsultationDTO();
        dto.setConsultationId(consultation.getConsultationId());
        dto.setCustomerId(consultation.getCustomer().getCustomer().getUserId());
        dto.setConsultantId(consultation.getConsultant().getConsultant().getUserId());
        dto.setTopic(consultation.getTopic());
        dto.setNote(consultation.getNote());
        dto.setDateScheduled(consultation.getDateScheduled());
        dto.setStatusDescription(getStatusDescription(consultation.getStatus()));
        dto.setRating(consultation.getRating());
        dto.setFeedback(consultation.getFeedback());

        // ✅ THÊM MỚI: Các field mới
        dto.setBookingId(consultation.getBooking().getBookingId());
        dto.setTimeSlot(consultation.getTimeSlot());
        dto.setUpdatedAt(consultation.getUpdatedAt());

        // ✅ THÊM MỚI: Thông tin bổ sung
        dto.setCustomerName(consultation.getCustomer().getFullName());
        dto.setCustomerEmail(consultation.getCustomer().getEmail());
        dto.setCustomerPhone(consultation.getCustomer().getPhoneNumber());
        dto.setConsultantName(consultation.getConsultant().getConsultant().getName());
        dto.setConsultantEmail(consultation.getConsultant().getConsultant().getEmail());

        // ✅ LẤY DANH SÁCH DỊCH VỤ
        List<String> serviceNames = consultation.getBooking().getServices()
                .stream()
                .map(Services::getServiceName)
                .collect(Collectors.toList());
        dto.setServiceNames(serviceNames);

        // ✅ Map danh sách loại categoryType
        List<ServiceCategoryType> categoryTypes = consultation.getBooking().getServices().stream()
                .map(Services::getCategoryType)
                .distinct()
                .collect(Collectors.toList());

        dto.setCategoryTypes(categoryTypes);


        return dto;
    }
    private String getStatusDescription(ConsultationStatus status) {
        return switch (status) {
            case PENDING -> "Chờ xác nhận";
            case CONFIRMED -> "Đã xác nhận";
            case SCHEDULED -> "Đã lên lịch";
            case ONGOING -> "Đang tư vấn";
            case COMPLETED -> "Hoàn thành";
            case CANCELED -> "Đã hủy";
            case RESCHEDULED -> "Đã đổi lịch";
        };
    }


}
