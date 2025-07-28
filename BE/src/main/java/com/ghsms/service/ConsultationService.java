package com.ghsms.service;

import com.ghsms.DTO.*;
import com.ghsms.file_enum.ConsultationStatus;
import com.ghsms.file_enum.RoleName;
import com.ghsms.file_enum.ServiceCategoryType;
import com.ghsms.model.*;
import com.ghsms.repository.ConsultantDetailsRepository;
import com.ghsms.repository.ConsultationRepository;
import com.ghsms.repository.CustomerDetailsRepository;
import com.ghsms.repository.UserRepository;
import jakarta.mail.Message;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
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

    public List<ConsultationDTO> getAllCustomerConsultations(Long customerId) {

        User customer = userRepository.findById(customerId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy khách hàng với ID: " + customerId));

        List<Consultation> consultations = consultationRepository
                .findByCustomerCustomerUserIdOrderByDateScheduledDesc(customerId);

        log.info("Tìm thấy {} consultation cho customer {}", consultations.size(), customerId);

        return consultations.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public Page<ConsultationDTO> getAllConsultantConsultations(Long consultantId, int page, int size) {
        User consultant = userRepository.findById(consultantId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tư vấn viên với ID: " + consultantId));

        if (!consultant.getRole().getName().equals(RoleName.ROLE_CONSULTANT)) {
            throw new RuntimeException("User không phải là tư vấn viên");
        }

        Pageable pageable = PageRequest.of(page, size);
        Page<Consultation> consultationsPage = consultationRepository
                .findByConsultantConsultantUserIdOrderByDateScheduledDesc(consultantId, pageable);

        return consultationsPage.map(this::toDTO);
    }

    @Transactional
    public ConsultationDTO updateConsultantNoteAndStatus(Long consultationId, ConsultationNoteStatusUpdateDTO dto, Long consultantId) {

        Consultation consultation = consultationRepository.findById(consultationId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy consultation với ID: " + consultationId));

        if (!consultation.getConsultant().getConsultant().getUserId().equals(consultantId)) {
            throw new RuntimeException("Bạn không có quyền chỉnh sửa consultation này");
        }

        if (dto.getNote() != null && !dto.getNote().trim().isEmpty()) {
            consultation.setNote(dto.getNote().trim());
        }

        if (dto.getStatus() != null) {
            consultation.setStatus(dto.getStatus());
        }

        Consultation savedConsultation = consultationRepository.save(consultation);

        log.info("Consultant {} đã cập nhật consultation {}: note={}, status={}",
                consultantId, consultationId,
                dto.getNote() != null, dto.getStatus());

        return toDTO(savedConsultation);
    }


    @Transactional
    public ConsultationDTO createConsultationWithMeetLink(ConsultationDTO consultationDTO, Long createdBy) {
        try {
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

            Consultation consultation = new Consultation();
            consultation.setCustomer(customer);
            consultation.setConsultant(consultant);
            consultation.setTopic(consultationDTO.getTopic());
            consultation.setTimeSlot(consultationDTO.getTimeSlot());
            consultation.setDateScheduled(consultationDTO.getDateScheduled());
            consultation.setStatus(ConsultationStatus.SCHEDULED);
            consultation.setBooking(new Booking(consultationDTO.getBookingId()));
            consultation.setUpdatedAt(LocalDateTime.now());
            consultation.setMeetLink(null);


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

    private void sendConsultationEmail(ConsultationDTO consultationDTO,
                                       String customerEmail,
                                       String consultantEmail,
                                       String meetLink) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();

        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        helper.setFrom(new InternetAddress("anmom8910@gmail.com"));
        helper.setTo(new String[]{customerEmail, consultantEmail});
        helper.setSubject("Cuộc tư vấn đã được lên lịch: " + consultationDTO.getTopic());

        String htmlContent = buildEmailContent(consultationDTO, meetLink);
        helper.setText(htmlContent, true);

        mailSender.send(message);
        log.info("Đã gửi email cuộc tư vấn đến {} và {}", customerEmail, consultantEmail);
    }


    private String buildEmailContent(ConsultationDTO dto, String meetLink) {
        String linkText = (meetLink == null || meetLink.isBlank())
                ? "<p style=\"color:#888\">Liên kết sẽ được cập nhật trước giờ tư vấn.</p>"
                : "<p><strong>Liên kết Google Meet:</strong> <a href=\"" + meetLink + "\">" + meetLink + "</a></p>";

        String certificateHtml = "";
        if (dto.getCertificates() != null && !dto.getCertificates().isEmpty()) {
            certificateHtml = "<ul style=\"margin-top: 5px; padding-left: 20px;\">";
            for (CertificateDTO cert : dto.getCertificates()) {
                certificateHtml += "<li>" + cert.getName() + "</li>";
            }
            certificateHtml += "</ul>";
        } else {
            certificateHtml = "<p style=\"color:#888\">(Tư vấn viên chưa cập nhật chứng chỉ)</p>";
        }

        return """
                <html>
                <body style="font-family:Arial, sans-serif; color:#333; padding:20px;">
                    <div style="max-width:600px; margin:0 auto; border:1px solid #ddd; border-radius:8px; padding:20px;">
                        <h2 style="color:#2b7a78; margin-top:0;">Lịch hẹn tư vấn của bạn</h2>
                        <p>Kính gửi <strong>%s</strong>,</p>
                        <p>Cuộc tư vấn của bạn đã được xác nhận với các thông tin sau:</p>
                        <ul style="padding-left:16px;">
                            <li><strong>Chủ đề:</strong> %s</li>
                            <li><strong>Ngày:</strong> %s</li>
                            <li><strong>Khung giờ:</strong> %s</li>
                        </ul>
                        %s <!-- ✅ linkText được chèn ở đây -->
                        <h3 style="margin-top:30px;">Thông tin tư vấn viên</h3>
                        <p><strong>Họ tên:</strong> %s</p>
                        <p><strong>Email:</strong> %s</p>
                        <p><strong>Chứng chỉ chuyên môn:</strong></p>
                        %s
                        <p style="margin-top:30px;">Trân trọng,<br><strong>Đội ngũ GHSMS</strong></p>
                    </div>
                </body>
                </html>
                """.formatted(
                dto.getCustomerName(),
                dto.getTopic(),
                dto.getDateScheduled(),
                dto.getTimeSlot(),
                linkText,
                dto.getConsultantName(),
                dto.getConsultantEmail(),
                certificateHtml
        );
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

        if (consultation.getMeetLink() == null) {
            consultation.setMeetLink(defaultMeetLink);
        }

        consultation.setStatus(ConsultationStatus.ONGOING);
        consultation.setUpdatedAt(LocalDateTime.now());
        consultationRepository.save(consultation);

        sendConsultationEmail(
                toDTO(consultation),
                consultation.getCustomer().getCustomer().getEmail(),
                consultation.getConsultant().getConsultant().getEmail(),
                consultation.getMeetLink()
        );

        return toDTO(consultation);
    }


    public ConsultationStatsDTO getTodayStats(Long consultantId) {
        try {
            LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
            LocalDateTime endOfDay = startOfDay.plusDays(1).minusNanos(1);

            List<Consultation> completedToday = consultationRepository
                    .findTodayCompletedByConsultant(consultantId, startOfDay, endOfDay);

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
            e.printStackTrace();
            return new ConsultationStatsDTO(0, 0, 0);
        }
    }


    @Transactional
    public ConsultationDTO submitFeedback(Long consultationId, Long userId, int rating, String feedback) {
        try {
            Consultation consultation = consultationRepository.findById(consultationId)
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy cuộc tư vấn"));

            System.out.println("✅ Found consultation");
            System.out.println("📌 Customer = " + consultation.getCustomer());
            System.out.println("📌 Nested customer = " + consultation.getCustomer().getCustomer());

            if (!consultation.getCustomer().getCustomer().getUserId().equals(userId)) {
                throw new RuntimeException("Bạn không có quyền đánh giá cuộc tư vấn này");
            }

            if (consultation.getStatus() == null || consultation.getStatus() != ConsultationStatus.COMPLETED) {
                throw new RuntimeException("Chỉ được đánh giá cuộc tư vấn đã hoàn thành");
            }

            consultation.setRating(rating);
            consultation.setFeedback(feedback);
            consultation.setUpdatedAt(LocalDateTime.now());

            Consultation saved = consultationRepository.save(consultation);
            return toDTO(saved);

        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
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

        CustomerDetails customer = consultation.getCustomer();
        ConsultantDetails consultant = consultation.getConsultant();

        return new ConsultationDetailsResponse(
                consultation.getConsultationId(),
                customer.getFullName(),
                customer.getCustomer().getEmail(),
                customer.getPhoneNumber(),
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


    private ConsultationDTO toDTO(Consultation consultation) {
        ConsultationDTO dto = new ConsultationDTO();
        dto.setConsultationId(consultation.getConsultationId());
        dto.setCustomerId(consultation.getCustomer().getCustomer().getUserId());
        dto.setConsultantId(consultation.getConsultant().getConsultant().getUserId());

        String topic = consultation.getBooking().getServices().stream()
                .map(Services::getServiceName)
                .collect(Collectors.joining(", "));
        dto.setTopic(topic);

        dto.setNote(consultation.getNote());
        dto.setDateScheduled(consultation.getDateScheduled());
        dto.setStatusDescription(getStatusDescription(consultation.getStatus()));
        dto.setRating(consultation.getRating());
        dto.setFeedback(consultation.getFeedback());

        dto.setMeetLink(consultation.getMeetLink());

        dto.setBookingId(consultation.getBooking().getBookingId());
        dto.setTimeSlot(consultation.getTimeSlot());
        dto.setUpdatedAt(consultation.getUpdatedAt());

        List<CertificateDTO> certificateDTOs = consultation.getConsultant().getCertificates()
                .stream()
                .map(cert -> new CertificateDTO(cert.getId(), cert.getName()))
                .collect(Collectors.toList());

        dto.setCertificates(certificateDTOs);

        dto.setCustomerName(consultation.getCustomer().getFullName());
        dto.setCustomerEmail(consultation.getCustomer().getEmail());
        dto.setCustomerPhone(consultation.getCustomer().getPhoneNumber());
        dto.setConsultantName(consultation.getConsultant().getConsultant().getName());
        dto.setConsultantEmail(consultation.getConsultant().getConsultant().getEmail());

        List<String> serviceNames = consultation.getBooking().getServices().stream()
                .map(Services::getServiceName)
                .collect(Collectors.toList());
        dto.setServiceNames(serviceNames);

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

    public Map<String, Long> getAllConsultationStatusCounts() {
        Map<String, Long> result = new LinkedHashMap<>();

        for (ConsultationStatus status : ConsultationStatus.values()) {
            long count = consultationRepository.countByStatus(status);
            result.put(status.name(), count);
        }

        return result;
    }


}
