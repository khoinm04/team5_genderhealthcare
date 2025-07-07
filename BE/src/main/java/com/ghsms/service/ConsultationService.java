package com.ghsms.service;

import com.ghsms.DTO.ConsultationDTO;
import com.ghsms.DTO.ConsultationDetailsResponse;
import com.ghsms.DTO.ConsultationNoteStatusUpdateDTO;
import com.ghsms.DTO.ConsultationStatsDTO;
import com.ghsms.file_enum.ConsultationStatus;
import com.ghsms.file_enum.RoleName;
<<<<<<< HEAD
import com.ghsms.model.*;
import com.ghsms.repository.ConsultantDetailsRepository;
=======
import com.ghsms.file_enum.ServiceCategoryType;
import com.ghsms.model.Consultation;
import com.ghsms.model.Services;
import com.ghsms.model.User;
>>>>>>> 8ae5ab8f (create blogpost, edit consultant' schedule, edit feature create account of admin)
import com.ghsms.repository.ConsultationRepository;
import com.ghsms.repository.CustomerDetailsRepository;
import com.ghsms.repository.UserRepository;

import jakarta.mail.Message;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final UserRepository userRepository;
    private final CustomerDetailsRepository customerDetailsRepository;
    private final ConsultantDetailsRepository consultantDetailsRepository;
    private final JavaMailSender mailSender;
    @Value("${ghsms.default-meet-link}")
    private String defaultMeetLink;



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

    @Transactional
    public ConsultationDTO createConsultationWithMeetLink(ConsultationDTO consultationDTO, Long createdBy) {
        try {
            // Kiểm tra khách hàng và tư vấn viên
            CustomerDetails customer = customerDetailsRepository.findById(consultationDTO.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + consultationDTO.getCustomerId()));
            ConsultantDetails consultant = consultantDetailsRepository.findById(consultationDTO.getConsultantId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy tư vấn viên với ID: " + consultationDTO.getConsultantId()));

            if (!consultant.getConsultant().getRole().getName().equals(RoleName.ROLE_CONSULTANT)) {
                throw new RuntimeException("Người dùng không phải là tư vấn viên");
            }

            if (!consultationDTO.isValidTimeSlot()) {
                throw new RuntimeException("Khung giờ không hợp lệ: thời gian kết thúc phải sau thời gian bắt đầu");
            }

            // Tạo thực thể cuộc tư vấn
            Consultation consultation = new Consultation();
            consultation.setCustomer(customer);
            consultation.setConsultant(consultant);
            consultation.setTopic(consultationDTO.getTopic());
            consultation.setTimeSlot(consultationDTO.getTimeSlot());
            consultation.setDateScheduled(consultationDTO.getDateScheduled());
            consultation.setStatus(ConsultationStatus.SCHEDULED);
            consultation.setBooking(new Booking(consultationDTO.getBookingId()));
            consultation.setUpdatedAt(LocalDateTime.now());
            // Không set meetLink ở đây nữa → để là null
            consultation.setMeetLink(null);
            // 🟢 Dùng link cố định

            Consultation saved = consultationRepository.save(consultation);

            sendConsultationEmail(consultationDTO,
                    customer.getCustomer().getEmail(),
                    consultant.getConsultant().getEmail(),
                    "Link sẽ được cập nhật trước buổi tư vấn");


            return toDTO(saved);
        } catch (Exception e) {
            log.error("Lỗi khi tạo cuộc tư vấn: {}", e.getMessage());
            throw new RuntimeException("Không thể tạo cuộc tư vấn: " + e.getMessage());
        }
    }

    private void sendConsultationEmail(ConsultationDTO consultationDTO, String customerEmail, String consultantEmail, String meetLink) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        message.setFrom(new InternetAddress("anmom8910@gmail.com"));
        message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(customerEmail + "," + consultantEmail));
        message.setSubject("Cuộc tư vấn đã được lên lịch: " + consultationDTO.getTopic());
        message.setText(buildEmailContent(consultationDTO, meetLink));

        mailSender.send(message);
        log.info("Đã gửi email cuộc tư vấn đến {} và {}", customerEmail, consultantEmail);
    }

    private String buildEmailContent(ConsultationDTO dto, String meetLink) {
        String linkText = (meetLink == null || meetLink.isBlank())
                ? "Liên kết sẽ được cập nhật trước giờ tư vấn."
                : "Liên kết Google Meet: " + meetLink;

        return "Kính gửi " + dto.getCustomerName() + ",\n\n" +
                "Cuộc tư vấn của bạn đã được lên lịch.\n" +
                "Chủ đề: " + dto.getTopic() + "\n" +
                "Ngày: " + dto.getDateScheduled() + "\n" +
                "Khung giờ: " + dto.getTimeSlot() + "\n" +
                linkText + "\n\n" +
                "Trân trọng,\nĐội ngũ GHSMS";
    }



    @Transactional
    public ConsultationDTO markConsultationComplete(Long consultationId, Long consultantId) {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc tư vấn"));

        log.info("🔍 Kiểm tra quyền sở hữu của consultantId = {} với consultationId = {}", consultantId, consultationId);

        if (!consultation.getConsultant().getConsultant().getUserId().equals(consultantId)) {
            log.warn("⛔️ Quyền truy cập không hợp lệ: User {} không sở hữu consultation {}", consultantId, consultationId);
            throw new RuntimeException("Bạn không có quyền cập nhật cuộc tư vấn này");
        }

        log.info("✅ Cập nhật trạng thái consultationId = {} thành COMPLETED", consultationId);

        if (consultation.getStatus() == ConsultationStatus.COMPLETED) {
            throw new RuntimeException("Cuộc tư vấn đã hoàn thành trước đó");
        }

        consultation.setStatus(ConsultationStatus.COMPLETED);
        consultation.setUpdatedAt(LocalDateTime.now());
        consultationRepository.save(consultation);

        return toDTO(consultation);
    }

    @Transactional
    public ConsultationDTO startConsultation(Long consultationId, Long consultantId) throws Exception {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc tư vấn"));

        if (!consultation.getConsultant().getConsultant().getUserId().equals(consultantId)) {
            throw new RuntimeException("Bạn không có quyền bắt đầu cuộc tư vấn này");
        }

        // Gán link cố định nếu chưa có
        if (consultation.getMeetLink() == null) {
            consultation.setMeetLink(defaultMeetLink);
        }

        consultation.setStatus(ConsultationStatus.ONGOING);
        consultation.setUpdatedAt(LocalDateTime.now());
        consultationRepository.save(consultation);

        // Gửi email nếu muốn
        sendConsultationEmail(
                toDTO(consultation),
                consultation.getCustomer().getCustomer().getEmail(),
                consultation.getConsultant().getConsultant().getEmail(),
                defaultMeetLink
        );

        return toDTO(consultation);
    }

    public ConsultationStatsDTO getTodayStats(Long consultantId) {
        try {
            List<Consultation> completedToday = consultationRepository.findTodayCompletedByConsultant(consultantId);

            int totalSessions = completedToday.size();
            long totalMinutes = 0;

            for (Consultation c : completedToday) {
                if (c.getStartTime() != null && c.getEndTime() != null) {
                    long duration = ChronoUnit.MINUTES.between(c.getStartTime(), c.getEndTime());
                    totalMinutes += duration;
                }
            }

            double average = totalSessions > 0 ? (double) totalMinutes / totalSessions : 0;

            return new ConsultationStatsDTO(totalSessions, totalMinutes, average);
        } catch (Exception e) {
            e.printStackTrace(); // log chi tiết lỗi
            return new ConsultationStatsDTO(0, 0, 0); // fallback tránh 500
        }
    }


    @Transactional
    public ConsultationDTO submitFeedback(Long consultationId, Long userId, int rating, String feedback) {
        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc tư vấn"));

        // ✅ Kiểm tra quyền người dùng (userId phải là chủ cuộc tư vấn)
        if (!consultation.getCustomer().getCustomer().getUserId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền đánh giá cuộc tư vấn này");
        }

        if (consultation.getStatus() != ConsultationStatus.COMPLETED) {
            throw new RuntimeException("Chỉ được đánh giá cuộc tư vấn đã hoàn thành");
        }

        // ✅ Cập nhật feedback và rating
        consultation.setRating(rating);
        consultation.setFeedback(feedback);
        consultation.setUpdatedAt(LocalDateTime.now());

        Consultation saved = consultationRepository.save(consultation);
        return toDTO(saved);
    }

    public Consultation getConsultationById(Long id) {
        return consultationRepository.findWithConsultantById(id).orElse(null);
    }

    @Transactional
    public void updateNoteOnly(Long id, String note) {
        consultationRepository.updateNoteById(id, note);
    }

    public ConsultationDetailsResponse getConsultationDetails(Long consultationId, Long userId) {
        System.out.println("🔍 Đang tìm consultationId = " + consultationId + " cho userId = " + userId);

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy buổi tư vấn"));

        if (!consultation.getBooking().getCustomer().getCustomerId().equals(userId)) {
            throw new RuntimeException("Bạn không có quyền xem buổi tư vấn này.");
        }

        System.out.println("✅ Đã xác thực quyền truy cập buổi tư vấn.");

        // Optional: kiểm tra quyền truy cập nếu cần

        CustomerDetails customer = consultation.getCustomer();
        ConsultantDetails consultant = consultation.getConsultant();

        return new ConsultationDetailsResponse(
                consultation.getConsultationId(),
                customer.getFullName(),
                customer.getCustomer().getEmail(),
                customer.getCustomer().getPhoneNumber(),
                customer.getCustomer().getCustomerDetails().getGender(),

                consultant.getConsultant().getName(),
                consultant.getSpecialization().toString(),

                consultation.getDateScheduled(),
                consultation.getTimeSlot(),
                consultation.getNote(),

                consultation.getFeedback(),
                consultation.getRating()
        );
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

        // 🟢 BỔ SUNG DÒNG NÀY:
        dto.setMeetLink(consultation.getMeetLink());

        // ✅ Các field bổ sung
        dto.setBookingId(consultation.getBooking().getBookingId());
        dto.setTimeSlot(consultation.getTimeSlot());
        dto.setUpdatedAt(consultation.getUpdatedAt());

        dto.setCustomerName(consultation.getCustomer().getFullName());
        dto.setCustomerEmail(consultation.getCustomer().getEmail());
        dto.setCustomerPhone(consultation.getCustomer().getPhoneNumber());
        dto.setConsultantName(consultation.getConsultant().getConsultant().getName());
        dto.setConsultantEmail(consultation.getConsultant().getConsultant().getEmail());

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
