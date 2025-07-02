package com.ghsms.service;

import com.ghsms.DTO.*;
import com.ghsms.file_enum.*;
import com.ghsms.model.*;
import com.ghsms.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import com.ghsms.mapper.BookingMapper;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class ConsultantDetailsService {

    private final ConsultantDetailsRepository consultantDetailsRepository;
    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;
    private final BookingMapper bookingMapper;
    private final ServiceRepository serviceRepository;
    private final RoleRepository roleRepository;
    private final CustomerDetailsRepository customerDetailsRepository;
    private final ConsultationRepository ConsultationRepository;

    @Autowired
    private PasswordEncoder passwordEncoder; // hoặc constructor injection


    public List<ConsultantDetails> getAllConsultants() {
        return consultantDetailsRepository.findAll();
    }

    public Optional<ConsultantDetails> getById(Long consultantId) {
        return consultantDetailsRepository.findById(consultantId);
    }

    @Transactional
    public void updateConsultantAndUser(ConsultantUpdateRequestDto dto) {
        // 1. Lấy user ra trước
        User user = userRepository.findById(dto.getConsultantId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tư vấn viên"));

        // 2. Cập nhật thông tin cơ bản của User
        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        userRepository.save(user); // nên gọi save để đảm bảo cập nhật

        // 3. Lấy hoặc khởi tạo ConsultantDetails
        ConsultantDetails details = consultantDetailsRepository.findById(dto.getConsultantId())
                .orElseGet(() -> {
                    ConsultantDetails newDetails = new ConsultantDetails();
                    newDetails.setConsultant(user); // do dùng @MapsId
                    return newDetails;
                });

        // 4. Gán thông tin chuyên môn
        details.setSpecialization(dto.getSpecialization());
        details.setHireDate(dto.getHireDate());
        details.setYearsOfExperience(dto.getYearsOfExperience());

        // 5. Lưu lại
        consultantDetailsRepository.save(details);
    }


    public void deleteById(Long consultantId) {
        consultantDetailsRepository.deleteById(consultantId);
    }

    public List<BookingDTO> getAllConsultingBookings() {
        return bookingRepository.findAllConsultingBookings()
                .stream()
                .map(bookingMapper::toDTO)
                .toList();
    }

    // tìm chuyên môn cua thang service ung voi consutantdetail dong thời gán onsultantId cho hai bang booking va consultation
    @Transactional
    public void updateConsultationBooking(Long bookingId, ConsultationBookingUpdateRequest req) {
        log.info("Dữ liệu nhận được: {}", req);

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy lịch hẹn"));

        Services service = serviceRepository.findById(req.getServiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vụ"));

        ConsultantDetails consultant = null;
        if (req.getConsultantId() != null) {
            consultant = consultantDetailsRepository
                    .findByConsultant_UserIdAndConsultant_IsActive(req.getConsultantId(), true)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tư vấn viên không hợp lệ hoặc không hoạt động"));
        }

        try {
            bookingMapper.updateFromConsultationDTO(booking, req, service, consultant);
            bookingRepository.save(booking);

            // Cập nhật hoặc tạo mới consultation nếu cần
            Consultation consultation = ConsultationRepository.findByBooking_BookingId(bookingId)
                    .orElseGet(() -> {
                        Consultation newConsultation = new Consultation();
                        newConsultation.setBooking(booking);
                        return newConsultation;
                    });

            consultation.setConsultant(consultant);
            ConsultationRepository.save(consultation);
        } catch (Exception e) {
            log.error("Lỗi khi cập nhật booking: {}", e.getMessage(), e);
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Lỗi khi cập nhật booking");
        }
    }



    //service để lấy danh sách tư vấn viên
    public List<ConsultantDetailsDTO> findActiveConsultantsByServiceId(Long serviceId) {
        // 1. Lấy service
        Services service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy dịch vụ"));

        // 2. Lấy specialization của service
        ConsultantSpecialization specialization = service.getSpecialization();

        // 3. Lấy danh sách tư vấn viên theo specialization và đang hoạt động
        List<ConsultantDetails> consultants =
                consultantDetailsRepository.findBySpecializationAndConsultant_IsActive(specialization, true);

        // 4. Map sang DTO để trả về
        return consultants.stream()
                .map(ConsultantDetailsDTO::fromEntity)
                .collect(Collectors.toList());
    }
//them lich hen moi
    @Transactional
    public Long createConsultationBooking(ConsultationBookingCreateRequest req) {
        // Validate service
        Services service = serviceRepository.findById(req.getServiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vụ"));

        // Validate consultant if provided
        ConsultantDetails consultant = null;
        if (req.getConsultantId() != null) {
            consultant = consultantDetailsRepository
                    .findByConsultant_UserIdAndConsultant_IsActive(req.getConsultantId(), true)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tư vấn viên không hợp lệ"));
        }

        // Create user for customer first
        User user = new User();
        user.setName(req.getCustomerName());
        user.setEmail(req.getCustomerEmail());
        user.setPhoneNumber(req.getCustomerPhone());
        user.setIsActive(true);
        user.setAuthProvider(AuthProvider.LOCAL); // hoặc GOOGLE nếu login từ Google

// Gán role là CUSTOMER (bắt buộc)
        Role customerRole = roleRepository.findByName(RoleName.ROLE_CUSTOMER)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy role CUSTOMER"));
        user.setRole(customerRole);

        String defaultPassword = "123@Abcd"; // hoặc random
        user.setPasswordHash(passwordEncoder.encode(defaultPassword));

        userRepository.save(user); // phải save để có ID


        CustomerDetails customer = new CustomerDetails();
        customer.setCustomer(user); // gán user vào
        customer.setFullName(req.getCustomerName());
        customer.setEmail(req.getCustomerEmail());
        customer.setPhoneNumber(req.getCustomerPhone());

// nếu cần thêm age/gender:
        customer.setAge(req.getAge());
        customer.setGender(req.getGender());


        customerDetailsRepository.save(customer); // save riêng để đảm bảo consistency


        // Create booking
        Booking booking = new Booking();
        booking.setBookingDate(req.getBookingDate());
        booking.setTimeSlot(req.getTimeSlot());
        booking.setStatus(BookingStatus.PENDING_PAYMENT);
        booking.setServices(Set.of(service));
        booking.setConsultant(consultant);
        booking.setCustomer(customer); // gán customerDetails

        bookingRepository.save(booking);

        return booking.getBookingId();
    }




}
