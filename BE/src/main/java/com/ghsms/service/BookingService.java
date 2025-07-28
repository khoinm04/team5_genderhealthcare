package com.ghsms.service;

import com.ghsms.DTO.BookingDTO;
import com.ghsms.DTO.BookingResponseHistoryDTO;
import com.ghsms.DTO.BookingUpdateRequestDTO;
import com.ghsms.file_enum.*;
import com.ghsms.mapper.BookingMapper;
import com.ghsms.model.*;
import com.ghsms.repository.*;
import com.ghsms.util.ReportGenerator;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import lombok.extern.slf4j.Slf4j;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final ServiceRepository serviceRepository;
    private final CustomerDetailsRepository customerDetailsRepository;
    private final TestResultRepository testResultRepository;
    private final ReportGenerator reportGenerator;
    private final StaffDetailsRepository staffDetailsRepository;
    private final ConsultantDetailsRepository consultantDetailsRepository;
    private final BookingMapper bookingMapper;
    private final ConsultationRepository consultationRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final NotificationRepository notificationRepository;


    private final MailService mailService;


    @PersistenceContext
    private EntityManager entityManager;


    public Booking createBooking(BookingDTO bookingDTO) {
        CustomerDetails customerDetails = null;
        User user = null;

        if (bookingDTO.getUserId() != null) {
            user = userRepository.findById(bookingDTO.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
            customerDetails = user.getCustomerDetails();
            if (customerDetails == null) {
                customerDetails = new CustomerDetails();
                customerDetails.setFullName(bookingDTO.getCustomerName());
                customerDetails.setEmail(bookingDTO.getCustomerEmail());
                customerDetails.setPhoneNumber(bookingDTO.getCustomerPhone());
                customerDetails.setAge(bookingDTO.getCustomerAge());
                customerDetails.setGender(bookingDTO.getCustomerGender());
                customerDetails.setCustomer(user);
                customerDetails = customerDetailsRepository.save(customerDetails);
            }
        } else {
            customerDetails = new CustomerDetails();
            customerDetails.setFullName(bookingDTO.getCustomerName());
            customerDetails.setEmail(bookingDTO.getCustomerEmail());
            customerDetails.setPhoneNumber(bookingDTO.getCustomerPhone());
            customerDetails.setAge(bookingDTO.getCustomerAge());
            customerDetails.setGender(bookingDTO.getCustomerGender());
            customerDetails = customerDetailsRepository.save(customerDetails);
        }

        List<Services> servicesList = bookingDTO.getServiceIds().stream()
                .map(id -> serviceRepository.findById(id)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with ID: " + id)))
                .toList();

        boolean allConsultation = servicesList.stream()
                .allMatch(s -> s.getCategoryType() == ServiceCategoryType.CONSULTATION);

        if (!allConsultation) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Chỉ được đặt dịch vụ tư vấn tại API này.");
        }

        int consultationCount = consultationRepository.countActiveConsultationsByDateAndSlot(
                bookingDTO.getBookingDate(),
                bookingDTO.getTimeSlot(),
                ConsultationStatus.CANCELED
        );

        if (consultationCount >= 10) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Khung giờ tư vấn này đã đủ 10 lượt. Vui lòng chọn khung khác.");
        }

        Booking booking = new Booking();
        booking.setCustomer(customerDetails);
        booking.setBookingDate(bookingDTO.getBookingDate());
        booking.setTimeSlot(bookingDTO.getTimeSlot());
        booking.setStatus(BookingStatus.COMPLETED);
        servicesList.forEach(booking::addService);

        Booking savedBooking = bookingRepository.save(booking);

        Consultation consultation = new Consultation();
        consultation.setCustomer(customerDetails);
        consultation.setBooking(savedBooking);
        consultation.setDateScheduled(bookingDTO.getBookingDate());
        consultation.setTimeSlot(bookingDTO.getTimeSlot());
        consultation.setStatus(ConsultationStatus.CONFIRMED);
        consultation.setTopic(bookingDTO.getTopic());
        consultation.setNote(bookingDTO.getNote());

        consultationRepository.save(consultation);

        LocalDate parsedDate = LocalDate.parse(booking.getBookingDate(), DateTimeFormatter.ISO_LOCAL_DATE);
        String formattedDate = parsedDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

        if (user != null) {
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setMessage("Bạn đã đặt lịch tư vấn vào ngày " + formattedDate + " lúc " + booking.getTimeSlot() + ".");
            notification.setRead(false);
            notificationRepository.save(notification);
        }

        String serviceNames = servicesList.stream()
                .map(Services::getServiceName)
                .collect(Collectors.joining(", "));

        String subject = "Xác nhận đặt lịch tư vấn";

        String htmlBody = buildBookingConfirmationEmail(
                customerDetails.getFullName(),
                formattedDate,
                booking.getTimeSlot(),
                serviceNames
        );

        mailService.sendHtmlEmail(customerDetails.getEmail(), subject, htmlBody);


        return savedBooking;
    }

    private String buildBookingConfirmationEmail(String fullName, String date,
                                                 String timeSlot, String serviceNames) {
        return """
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <h2 style="color: #2b7a78;">Xác nhận đặt lịch tư vấn</h2>
                        <p>Chào <strong>%s</strong>,</p>
                        <p>Bạn đã <strong>đặt lịch tư vấn thành công</strong> với thông tin sau:</p>
                
                        <table style="width: 100%%; border-collapse: collapse; margin-top: 16px;">
                            <tr>
                                <td style="padding: 8px 0;"><strong>📅 Ngày hẹn:</strong></td>
                                <td>%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong>⏰ Khung giờ:</strong></td>
                                <td>%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong>🛠 Dịch vụ đã chọn:</strong></td>
                                <td>%s</td>
                            </tr>
                        </table>
                
                        <p style="margin-top: 24px;">Chúng tôi sẽ liên hệ với bạn trước lịch hẹn để xác nhận lại thông tin.</p>
                
                        <p style="margin-top: 32px;">Trân trọng,<br><strong>Trung tâm Y tế</strong></p>
                    </div>
                </body>
                </html>
                """.formatted(fullName, date, timeSlot, serviceNames);
    }


    public Booking findByPaymentCode(String paymentCode) {
        return bookingRepository.findByPaymentCode(paymentCode)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Booking not found with payment code: " + paymentCode));
    }

    public Booking createStiBooking(BookingDTO bookingDTO) {
        CustomerDetails customerDetails;
        User user;

        if (bookingDTO.getUserId() != null) {
            user = userRepository.findById(bookingDTO.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
            customerDetails = user.getCustomerDetails();
            if (customerDetails == null) {
                customerDetails = new CustomerDetails();
                customerDetails.setFullName(bookingDTO.getCustomerName());
                customerDetails.setEmail(bookingDTO.getCustomerEmail());
                customerDetails.setPhoneNumber(bookingDTO.getCustomerPhone());
                customerDetails.setAge(bookingDTO.getCustomerAge());
                customerDetails.setGender(bookingDTO.getCustomerGender());
                customerDetails.setCustomer(user);
                customerDetails = customerDetailsRepository.save(customerDetails);
            }
        } else {
            user = new User();
            user.setName(bookingDTO.getCustomerName());
            user.setEmail(bookingDTO.getCustomerEmail());
            user.setPhoneNumber(bookingDTO.getCustomerPhone());
            user.setIsActive(true);
            user.setAuthProvider(AuthProvider.LOCAL);

            Role customerRole = roleRepository.findByName(RoleName.ROLE_CUSTOMER)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy role CUSTOMER"));
            user.setRole(customerRole);
            user.setPasswordHash(passwordEncoder.encode("123@Abcd"));   // mật khẩu mặc định
            user = userRepository.save(user);

            customerDetails = new CustomerDetails();
            customerDetails.setFullName(bookingDTO.getCustomerName());
            customerDetails.setEmail(bookingDTO.getCustomerEmail());
            customerDetails.setPhoneNumber(bookingDTO.getCustomerPhone());
            customerDetails.setAge(bookingDTO.getCustomerAge());
            customerDetails.setGender(bookingDTO.getCustomerGender());
            customerDetails.setCustomer(user);
            customerDetails = customerDetailsRepository.save(customerDetails);
        }

        int current = testResultRepository.countActiveTestResultsByDateAndSlot(
                bookingDTO.getBookingDate(),
                bookingDTO.getTimeSlot(),
                TestStatus.CANCELED
        );
        if (current >= 10) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Khung giờ này đã đủ 10 ca xét nghiệm. Vui lòng chọn khung giờ khác."
            );
        }

        Booking booking = new Booking();
        booking.setCustomer(customerDetails);
        booking.setBookingDate(bookingDTO.getBookingDate());
        booking.setTimeSlot(bookingDTO.getTimeSlot());
        booking.setStatus(BookingStatus.COMPLETED);

        for (Long serviceId : bookingDTO.getServiceIds()) {
            Services service = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with ID: " + serviceId));

            if ("STI".equalsIgnoreCase(bookingDTO.getCategoryType())
                    && service.getCategoryType() != ServiceCategoryType.TEST) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "Only STI test services are allowed for booking type STI");
            }

            booking.addService(service);
        }



        booking = bookingRepository.save(booking);

        LocalDate parsedDate = LocalDate.parse(booking.getBookingDate());
        String formattedDate = parsedDate.format(DateTimeFormatter.ofPattern("dd/MM/yyyy"));

        if (user.getUserId() != null) {
            Notification notification = new Notification();
            notification.setUser(user);
            notification.setMessage("Bạn đã đặt lịch xét nghiệm vào ngày " + formattedDate + " lúc " + booking.getTimeSlot() + ".");
            notification.setRead(false);
            notificationRepository.save(notification);
        }

        String serviceNames = booking.getServices().stream()
                .map(Services::getServiceName)
                .collect(Collectors.joining(", "));

        String subject = "Xác nhận đặt lịch xét nghiệm STI";

        String htmlBody = buildTestBookingEmail(
                customerDetails.getFullName(),
                formattedDate,
                booking.getTimeSlot(),
                serviceNames
        );

        mailService.sendHtmlEmail(customerDetails.getEmail(), subject, htmlBody);


        LocalDateTime appointmentTime =
                LocalDateTime.parse(booking.getBookingDate() + "T" + booking.getTimeSlot().split("-")[0]);

        for (Services service : booking.getServices()) {
            TestResult tr = new TestResult();
            tr.setBooking(booking);
            tr.setTestName(service.getServiceName());
            tr.setStatus(TestStatus.PENDING);
            tr.setGeneratedAt(LocalDateTime.now());
            tr.setScheduledTime(appointmentTime);
            tr.setEstimatedCompletionTime(appointmentTime.plusHours(3));
            tr.setCurrentPhase("Scheduled");
            tr.setProgressPercentage(0);
            tr.setLastUpdated(LocalDateTime.now());
            testResultRepository.save(tr);
        }

        return booking;
    }

    private String buildTestBookingEmail(String fullName, String date,
                                         String timeSlot, String serviceNames) {
        return """
                <html>
                <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f9f9f9;">
                    <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; padding: 20px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                        <h2 style="color: #d63384;">Xác nhận đặt lịch xét nghiệm STI</h2>
                        <p>Chào <strong>%s</strong>,</p>
                        <p>Bạn đã <strong>đặt lịch xét nghiệm thành công</strong> với thông tin sau:</p>
                
                        <table style="width: 100%%; border-collapse: collapse; margin-top: 16px;">
                            <tr>
                                <td style="padding: 8px 0;"><strong>📅 Ngày hẹn:</strong></td>
                                <td>%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong>⏰ Khung giờ:</strong></td>
                                <td>%s</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0;"><strong>🧪 Dịch vụ xét nghiệm:</strong></td>
                                <td>%s</td>
                            </tr>
                        </table>
                
                        <p style="margin-top: 24px;">
                            Vui lòng đến đúng giờ để thực hiện xét nghiệm.
                        </p>
                
                        <p style="margin-top: 32px;">Trân trọng,<br><strong>Trung tâm Y tế</strong></p>
                    </div>
                </body>
                </html>
                """.formatted(fullName, date, timeSlot, serviceNames);
    }


    public byte[] generateTestResultReport(Long bookingId, ReportFormat format) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        List<TestResult> results = findByBookingIdAndStatusCustom(bookingId, TestStatus.COMPLETED.name());

        if (results.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No completed test results available");
        }

        return reportGenerator.generateReport(results, format);
    }


    public Booking findBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Booking not found with ID: " + bookingId));
    }

    public TestResult updateTestStatus(Long bookingId, Long testResultId, TestStatus status, String notes) {
        Booking booking = findBookingById(bookingId);

        TestResult testResult = testResultRepository.findById(testResultId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Test result not found with ID: " + testResultId));

        if (!testResult.getBooking().getBookingId().equals(bookingId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Test result does not belong to the specified booking");
        }

        testResult.setStatus(status);
        testResult.setLastUpdated(LocalDateTime.now());

        switch (status) {
            case PENDING -> {
                testResult.setProgressPercentage(0);
                testResult.setCurrentPhase("Scheduled");
            }
            case IN_PROGRESS -> {
                testResult.setProgressPercentage(50);
                testResult.setCurrentPhase("Processing");
            }
            case COMPLETED -> {
                testResult.setProgressPercentage(100);
                testResult.setCurrentPhase("Completed");
            }
            case CANCELED -> {
                testResult.setProgressPercentage(0);
                testResult.setCurrentPhase("Canceled");
            }
        }

        if (notes != null && !notes.trim().isEmpty()) {
            testResult.setNotes(notes);
        }

        return testResultRepository.save(testResult);
    }


    public Booking updateBookingStatus(Long bookingId, BookingStatus status) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public Page<Booking> getUserBookings(Long userId, Pageable pageable) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID cannot be null");
        }
        return bookingRepository.findByCustomer_Customer_UserId(userId, pageable);
    }

    public Page<Booking> getUserBookings(Long userId, Pageable pageable, String type) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID cannot be null");
        }

        if (type == null || type.isBlank()) {
            return bookingRepository.findByCustomer_Customer_UserId(userId, pageable);
        }

        try {
            ServiceCategoryType categoryType = ServiceCategoryType.valueOf(type.toUpperCase());
            return bookingRepository.findByCustomer_Customer_UserIdAndServices_CategoryType(userId, categoryType, pageable);
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Loại dịch vụ không hợp lệ: " + type);
        }
    }


    public List<Booking> getBookingsByCategory(String category) {
        return bookingRepository.findByServiceCategory(category);
    }

    public List<Booking> getBookingsByCategoryAndDate(String category, String date) {
        return bookingRepository.findByBookingDateAndService_Category(date, category);
    }

    private List<TestResult> findByBookingIdAndStatusCustom(Long bookingId, String status) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<TestResult> cq = cb.createQuery(TestResult.class);
        Root<TestResult> root = cq.from(TestResult.class);

        cq.select(root)
                .where(
                        cb.equal(root.get("booking").get("bookingId"), bookingId),
                        cb.equal(root.get("status"), status)
                );
        return entityManager.createQuery(cq).getResultList();
    }

    public Page<BookingDTO> getPagedBookingsForManager(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Long> idPage = bookingRepository.findPagedBookingIds(pageable);

        List<Booking> bookings = bookingRepository.findBookingsWithDetailsByIds(idPage.getContent());

        List<BookingDTO> dtos = bookings.stream()
                .map(bookingMapper::toDTO) // dùng class mapper
                .collect(Collectors.toList());

        return new PageImpl<>(dtos, pageable, idPage.getTotalElements());
    }



    private static final Set<String> TEST_CATEGORIES = Set.of(
            "STI_HIV",
            "STI_Syphilis",
            "STI_Gonorrhea",
            "STI_Chlamydia"
    );

    private static final Set<String> CONSULTANT_CATEGORIES = Set.of(
            "GENERAL_CONSULTATION",
            "SPECIALIST_CONSULTATION",
            "RE_EXAMINATION",
            "EMERGENCY_CONSULTATION"
    );


    @Transactional
    public void assignStaffToBooking(Long bookingId, Long staffUserId) {
        try {

            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> {
                        return new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy lịch hẹn");
                    });

            boolean allAreTestServices = booking.getServices().stream()
                    .allMatch(service -> TEST_CATEGORIES.contains(service.getCategory()));

            log.debug("Tất cả dịch vụ thuộc nhóm xét nghiệm? {}", allAreTestServices);

            if (!allAreTestServices) {
                log.warn("Booking {} chứa dịch vụ không thuộc nhóm xét nghiệm. Không thể gán staff.", bookingId);
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Chỉ được gán staff cho các dịch vụ thuộc nhóm xét nghiệm"
                );
            }

            StaffDetails staff = staffDetailsRepository.findByStaffUserIdAndActive(staffUserId, true)
                    .orElseThrow(() -> {
                        return new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Không tìm thấy nhân viên hoặc đã ngưng hoạt động"
                        );
                    });

            booking.setStaff(staff);
            bookingRepository.save(booking);

        } catch (Exception ex) {
            throw ex;
        }
    }

    public void updateStatus(Long bookingId, String statusString) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy booking với id: " + bookingId));

        try {
            BookingStatus status = BookingStatus.valueOf(statusString.toUpperCase());
            booking.setStatus(status);
            bookingRepository.save(booking);
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Trạng thái không hợp lệ: " + statusString);
        }
    }

    @Transactional
    public void updateBookingFromDTO(Long bookingId, BookingDTO dto) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy lịch hẹn"));

        if (dto.getStaffId() != null) {
            User staff = userRepository.findById(dto.getStaffId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nhân viên"));
            booking.setStaff(staff.getStaffDetails());
        }

        if (dto.getConsultantId() != null) {
            User consultant = userRepository.findById(dto.getConsultantId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tư vấn viên"));
            booking.setConsultant(consultant.getConsultantDetails());

            consultationRepository.findByBooking_BookingId(bookingId)
                    .ifPresent(consultation -> {
                        consultation.setStatus(ConsultationStatus.SCHEDULED);
                        consultationRepository.save(consultation);
                    });
        }

        if (dto.getBookingDate() != null) {
            booking.setBookingDate(dto.getBookingDate());
        }

        if (dto.getTimeSlot() != null) {
            booking.setTimeSlot(dto.getTimeSlot());
        }

        if (dto.getCustomerName() != null) {
            booking.getCustomer().setFullName(dto.getCustomerName());
        }
        if (dto.getCustomerEmail() != null) {
            booking.getCustomer().setEmail(dto.getCustomerEmail());
        }
        if (dto.getCustomerPhone() != null) {
            booking.getCustomer().setPhoneNumber(dto.getCustomerPhone());
        }

        bookingRepository.save(booking);
    }

    public long countStiBookingsByUserId(Long userId) {
        List<String> stiCategories = List.of(
                "STI_HIV",
                "STI_Syphilis",
                "STI_Gonorrhea",
                "STI_Chlamydia"
        );

        List<Booking> bookings = bookingRepository.findAllStiBookingsByUserId(userId, stiCategories);
        return bookings.size();
    }

    public List<BookingDTO> getUpcomingSchedules() {
        LocalDate today = LocalDate.now();

        List<Booking> bookings = bookingRepository.findByBookingDateGreaterThanEqual(today.toString());
        return bookings.stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void assignConsultantToBooking(Long bookingId, Long consultantUserId) {
        try {
            Booking booking = bookingRepository.findById(bookingId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy lịch hẹn"));

            boolean anyConsultationService = booking.getServices().stream()
                    .anyMatch(service -> CONSULTANT_CATEGORIES.contains(service.getCategory()));

            if (!anyConsultationService) {
                log.warn("Booking {} không chứa dịch vụ tư vấn. Không thể gán tư vấn viên.", bookingId);
                throw new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Chỉ được gán tư vấn viên cho các dịch vụ thuộc nhóm tư vấn"
                );
            }

            ConsultantDetails consultant = consultantDetailsRepository
                    .findByConsultantUserIdAndActive(consultantUserId, true)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Không tìm thấy tư vấn viên hoặc đã ngưng hoạt động"
                    ));

            booking.setConsultant(consultant);
            bookingRepository.save(booking);

            consultationRepository.findByBooking_BookingId(bookingId)
                    .ifPresent(consultation -> {
                        consultation.setConsultant(consultant);
                        consultationRepository.save(consultation);
                    });

        } catch (Exception ex) {
            throw ex;
        }
    }

    public Page<BookingDTO> getBookingsByStaffUserId(Long staffUserId, Pageable pageable) {
        Page<Booking> bookings = bookingRepository.findAllByStaffUserId(staffUserId, pageable);
        return bookings.map(bookingMapper::toDTO);
    }



    @Transactional
    public void updateByStaff(BookingUpdateRequestDTO req) {
        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        if (req.getCustomerName() != null) {
            booking.getCustomer().setFullName(req.getCustomerName());
        }
        if (req.getCustomerPhone() != null) {
            booking.getCustomer().setPhoneNumber(req.getCustomerPhone());
        }

        if (req.getTestResultUpdates() != null) {
            for (var update : req.getTestResultUpdates()) {
                System.out.println("🔄 Updating TestResult ID: " + update.getTestResultId() + " to status: " + update.getStatus());

                TestResult result = testResultRepository.findById(update.getTestResultId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

                if (update.getStatus() != null) {
                    result.setStatus(update.getStatus());
                }

                if (update.getTestName() != null && !update.getTestName().isBlank()) {
                    result.setTestName(update.getTestName());
                }

                testResultRepository.save(result);
            }
        }

        bookingRepository.save(booking);
    }

    public long getTotalBookings() {
        return bookingRepository.count();
    }

    @Transactional
    public void updateStatusByStaff(Long bookingId, BookingStatus newStatus) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy booking với ID: " + bookingId));

        booking.setStatus(newStatus);
        bookingRepository.save(booking);
    }

    public Booking confirmPayment(String paymentCode) {
        Booking booking = findByPaymentCode(paymentCode);
        if (booking.getStatus() != BookingStatus.PENDING_PAYMENT) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Booking is not pending payment");
        }
        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(String paymentCode) {
        Booking booking = findByPaymentCode(paymentCode);
        if (booking.getStatus() == BookingStatus.COMPLETED || booking.getStatus() == BookingStatus.CANCELED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot cancel a completed or already canceled booking");
        }
        booking.setStatus(BookingStatus.CANCELED);
        return bookingRepository.save(booking);
    }

}