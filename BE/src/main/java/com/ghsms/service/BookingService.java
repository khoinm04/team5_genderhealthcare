package com.ghsms.service;

import com.ghsms.DTO.BookingDTO;
import com.ghsms.DTO.BookingUpdateRequestDTO;
import com.ghsms.file_enum.*;
import com.ghsms.mapper.BookingMapper;
import com.ghsms.model.*;
import com.ghsms.repository.*;
import com.ghsms.util.PaymentCodeGenerator;
import com.ghsms.util.ReportGenerator;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Root;
import jakarta.transaction.Transactional;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import lombok.extern.slf4j.Slf4j;


import java.time.LocalDate;
import java.time.LocalDateTime;
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
    private final PaymentCodeGenerator paymentCodeGenerator;
    private final CustomerDetailsRepository customerDetailsRepository;
    private final TestResultRepository testResultRepository;
    private final ReportGenerator reportGenerator;
    private final StaffDetailsRepository staffDetailsRepository;
    private final ConsultantDetailsRepository consultantDetailsRepository;
    private final BookingMapper bookingMapper;
    private final ConsultationRepository consultationRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;


    //danh cho websocket bang thong ke cua admin


    @PersistenceContext
    private EntityManager entityManager;

    public Booking createBooking(BookingDTO bookingDTO) {
        CustomerDetails customerDetails = null;

        User user = null;
        if (bookingDTO.getUserId() != null) {
            // Tìm user theo userId
            user = userRepository.findById(bookingDTO.getUserId())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            // Lấy CustomerDetails của user nếu có, nếu không thì tạo mới
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
            // Trường hợp khách không đăng nhập, tạo mới CustomerDetails từ thông tin form
            customerDetails = new CustomerDetails();
            customerDetails.setFullName(bookingDTO.getCustomerName());
            customerDetails.setEmail(bookingDTO.getCustomerEmail());
            customerDetails.setPhoneNumber(bookingDTO.getCustomerPhone());
            customerDetails.setAge(bookingDTO.getCustomerAge());
            customerDetails.setGender(bookingDTO.getCustomerGender());
            customerDetails = customerDetailsRepository.save(customerDetails);
        }

        Booking booking = new Booking();
        booking.setCustomer(customerDetails);
        booking.setBookingDate(bookingDTO.getBookingDate());
        booking.setTimeSlot(bookingDTO.getTimeSlot());
        booking.setStatus(BookingStatus.PENDING_PAYMENT);
        booking.setPaymentCode(paymentCodeGenerator.generatePaymentCode());

        for (Long serviceId : bookingDTO.getServiceIds()) {
            Services services = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.NOT_FOUND,
                            "Service not found with ID: " + serviceId));
            booking.addService(services);
        }


        return bookingRepository.save(booking);

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
            // 🔹 Trường hợp khách đã đăng nhập
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
            // 🔹 Trường hợp staff tạo giúp —> Tạo luôn User mới
            user = new User();
            user.setName(bookingDTO.getCustomerName());
            user.setEmail(bookingDTO.getCustomerEmail());
            user.setPhoneNumber(bookingDTO.getCustomerPhone());
            user.setIsActive(true);
            user.setAuthProvider(AuthProvider.LOCAL); // hoặc GOOGLE nếu có OAuth2

            Role customerRole = roleRepository.findByName(RoleName.ROLE_CUSTOMER)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy role CUSTOMER"));
            user.setRole(customerRole);

            // Mật khẩu mặc định (random hoặc cấu hình riêng)
            String defaultPassword = "123@Abcd"; // hoặc UUID.randomUUID().toString()
            user.setPasswordHash(passwordEncoder.encode(defaultPassword));

            user = userRepository.save(user);

            // ➕ Tạo CustomerDetails gắn với User vừa tạo
            customerDetails = new CustomerDetails();
            customerDetails.setFullName(bookingDTO.getCustomerName());
            customerDetails.setEmail(bookingDTO.getCustomerEmail());
            customerDetails.setPhoneNumber(bookingDTO.getCustomerPhone());
            customerDetails.setAge(bookingDTO.getCustomerAge());
            customerDetails.setGender(bookingDTO.getCustomerGender());
            customerDetails.setCustomer(user);

            customerDetails = customerDetailsRepository.save(customerDetails);
        }

        // Booking STI
        Booking booking = new Booking();
        booking.setCustomer(customerDetails);
        booking.setBookingDate(bookingDTO.getBookingDate());
        booking.setTimeSlot(bookingDTO.getTimeSlot());
        booking.setStatus(BookingStatus.PENDING_PAYMENT);
        booking.setPaymentCode(paymentCodeGenerator.generatePaymentCode());

        for (Long serviceId : bookingDTO.getServiceIds()) {
            Services service = serviceRepository.findById(serviceId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Service not found with ID: " + serviceId));

            if (!Set.of(
                    ServiceBookingCategory.STI_HIV,
                    ServiceBookingCategory.STI_Syphilis,
                    ServiceBookingCategory.STI_Gonorrhea,
                    ServiceBookingCategory.STI_Chlamydia
            ).contains(service.getCategory())) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only STI test services are allowed");
            }

            booking.addService(service);
        }

        booking = bookingRepository.save(booking);

        // ➕ Tạo TestResult
        LocalDateTime appointmentTime = LocalDateTime.parse(booking.getBookingDate() + "T" + booking.getTimeSlot().split("-")[0]);
        for (Services service : booking.getServices()) {
            TestResult testResult = new TestResult();
            testResult.setBooking(booking);
            testResult.setTestName(service.getServiceName());
            testResult.setStatus(TestStatus.PENDING);
            testResult.setGeneratedAt(LocalDateTime.now());
            testResult.setScheduledTime(appointmentTime);
            testResult.setEstimatedCompletionTime(appointmentTime.plusHours(3));
            testResult.setCurrentPhase("Scheduled");
            testResult.setProgressPercentage(0);
            testResult.setLastUpdated(LocalDateTime.now());
            testResult.setNotes("Appointment scheduled. Awaiting patient arrival.");

            testResultRepository.save(testResult);
        }



        return booking;
    }


    public Booking confirmStiPayment(String paymentCode) {
        Booking booking = findByPaymentCode(paymentCode);
        booking.setStatus(BookingStatus.CONFIRMED);
        return bookingRepository.save(booking);
    }

    public byte[] generateTestResultReport(Long bookingId, ReportFormat format) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));

        List<TestResult> results = findByBookingIdAndStatusCustom(bookingId, TestStatus.COMPLETED.name());

        if (results.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No completed test results available");
        }

        // ✅ Chỉ generate báo cáo từ danh sách kết quả
        return reportGenerator.generateReport(results, format);
    }


    // In BookingService.java
    public Booking findBookingById(Long bookingId) {
        return bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Booking not found with ID: " + bookingId));
    }

    public TestResult updateTestStatus(Long bookingId, Long testResultId, TestStatus status, String notes) {
        // Verify booking exists
        Booking booking = findBookingById(bookingId);

        // Find and update test result
        TestResult testResult = testResultRepository.findById(testResultId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Test result not found with ID: " + testResultId));

        // Verify test result belongs to the booking
        if (!testResult.getBooking().getBookingId().equals(bookingId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "Test result does not belong to the specified booking");
        }

        // Update status and related fields
        testResult.setStatus(status);
        testResult.setLastUpdated(LocalDateTime.now());

        // Update progress based on status
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

        // Update notes if provided
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

    public List<Booking> getUserBookings(Long userId) {
        if (userId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID cannot be null");
        }
        return bookingRepository.findByCustomer_Customer_UserId(userId);
    }

    public List<Booking> getBookingsByCategory(ServiceBookingCategory category) {
        return bookingRepository.findByServiceCategory(category);
    }

    public List<Booking> getBookingsByCategoryAndDate(ServiceBookingCategory category, String date) {
        return bookingRepository.findByBookingDateAndService_Category(date, category);
    }

    // Phương thức tùy chỉnh với Criteria API
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

    public List<BookingDTO> getAllBookingsForManager() {
        List<Booking> bookings = bookingRepository.findAllWithDetails();

        return bookings.stream().map(booking -> {
            BookingDTO dto = new BookingDTO();

            dto.setBookingId(booking.getBookingId());

            //thong tin khách hàng

            dto.setUserId(booking.getCustomer().getCustomer().getUserId());
            dto.setCustomerName(booking.getCustomer().getFullName());
            dto.setCustomerEmail(booking.getCustomer().getEmail());
            dto.setCustomerPhone(booking.getCustomer().getPhoneNumber());
            dto.setClient(booking.getCustomer().getFullName()); //dung cho react

            //Thong tin nhan vien
            if (booking.getStaff() != null) {
                dto.setStaffId(booking.getStaff().getStaff().getUserId());
                dto.setStaffName(booking.getStaff().getStaff().getName());
            }

            // Thông tin tư vấn viên
            if (booking.getConsultant() != null && booking.getConsultant().getConsultant() != null) {
                dto.setConsultantId(booking.getConsultant().getConsultant().getUserId());
                dto.setConsultantName(booking.getConsultant().getConsultant().getName());
            }


            //ngay đặt lịch
            dto.setBookingDate(booking.getBookingDate().toString());
            dto.setDate(dto.getBookingDate()); // field dành riêng cho React

            dto.setTimeSlot(booking.getTimeSlot());
            String[] timeParts = booking.getTimeSlot().split("-");
            if (timeParts.length == 2) {
                dto.setStartTime(timeParts[0]);
                dto.setEndTime(timeParts[1]);
            }

            // Trạng thái & category
            dto.setStatus(booking.getStatus());
            // Giả định mỗi booking chỉ có 1 dịch vụ nên lấy category từ dịch vụ đầu tiên
            dto.setCategory(booking.getServices().iterator().next().getCategory());

            //dich vu
            Set<Services> services = booking.getServices();

            dto.setServiceIds(
                    services.stream().map(Services::getServiceId).collect(Collectors.toList())
            );
            String serviceNames = services.stream()
                    .map(Services::getServiceName)
                    .collect(Collectors.joining(", "));

            dto.setServiceName(serviceNames); // đầy đủ

            return dto;
        }).collect(Collectors.toList());

    }

    private static final Set<ServiceBookingCategory> TEST_CATEGORIES = Set.of(
            ServiceBookingCategory.STI_HIV,
            ServiceBookingCategory.STI_Syphilis,
            ServiceBookingCategory.STI_Gonorrhea,
            ServiceBookingCategory.STI_Chlamydia
    );

    private static final Set<ServiceBookingCategory> CONSULTANT_CATEGORIES = Set.of(
            ServiceBookingCategory.GENERAL_CONSULTATION,
            ServiceBookingCategory.SPECIALIST_CONSULTATION,
            ServiceBookingCategory.RE_EXAMINATION,
            ServiceBookingCategory.EMERGENCY_CONSULTATION
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

        // Gán nhân viên nếu có
        if (dto.getStaffId() != null) {
            User staff = userRepository.findById(dto.getStaffId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy nhân viên"));
            booking.setStaff(staff.getStaffDetails());
        }

        // Gán tư vấn viên nếu có
        if (dto.getConsultantId() != null) {
            User consultant = userRepository.findById(dto.getConsultantId())
                    .orElseThrow(() -> new EntityNotFoundException("Không tìm thấy tư vấn viên"));
            booking.setConsultant(consultant.getConsultantDetails());
        }


        // Gán ngày nếu có (String "yyyy-MM-dd")
        if (dto.getBookingDate() != null) {
            booking.setBookingDate(dto.getBookingDate());
        }

        // Gán timeSlot nếu có (String "HH:mm-HH:mm")
        if (dto.getTimeSlot() != null) {
            booking.setTimeSlot(dto.getTimeSlot());
        }

        // Gán thông tin khách hàng nếu cho phép chỉnh
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


    public List<BookingDTO> getUpcomingSchedules() {
        LocalDate today = LocalDate.now();

        List<Booking> bookings = bookingRepository.findByBookingDateGreaterThanEqual(today.toString());
        return bookings.stream()
                .map(bookingMapper::toDTO) // hoặc tự map bằng tay
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

            // Gán vào booking
            booking.setConsultant(consultant);
            bookingRepository.save(booking);

            // Gán vào consultation nếu tồn tại
            consultationRepository.findByBooking_BookingId(bookingId)
                    .ifPresent(consultation -> {
                        consultation.setConsultant(consultant);
                        consultationRepository.save(consultation);
                    });

        } catch (Exception ex) {
            throw ex;
        }
    }


    // Lấy danh sách lịch hẹn sắp tới của nhân viên
    public List<BookingDTO> getBookingsByStaffUserId(Long staffUserId) {
        List<Booking> bookings = bookingRepository.findAllByStaffUserId(staffUserId);
        return bookings.stream()
                .map(bookingMapper::toDTO)
                .collect(Collectors.toList());
    }


    @Transactional
    public void updateByStaff(BookingUpdateRequestDTO req) {
        Booking booking = bookingRepository.findById(req.getBookingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // Cập nhật thông tin khách hàng
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

                testResultRepository.save(result); // ❗ Lưu riêng từng bản ghi TestResult
            }
        }

        // Lưu booking (nếu cascade sẽ lưu cả customer)
        bookingRepository.save(booking);
    }

    //de dem tong so dat lịch tren trang admin
    public long getTotalBookings() {
        return bookingRepository.count(); // dùng method mặc định
    }


}