package com.ghsms.service;

import com.ghsms.DTO.*;
import com.ghsms.file_enum.*;
import com.ghsms.model.*;
import com.ghsms.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
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

    public Optional<ConsultantDetails> getByUserId(Long userId) {
        return consultantDetailsRepository.findById(userId); // hoặc tùy theo bạn map theo field nào
    }

    @Transactional
    public void updateConsultantAndUser(ConsultantUpdateRequestDto dto) {

        User user = userRepository.findById(dto.getConsultantId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy tư vấn viên"));

        user.setName(dto.getName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getPhoneNumber());
        userRepository.save(user);

        ConsultantDetails details = consultantDetailsRepository.findById(dto.getConsultantId())
                .orElseGet(() -> {
                    ConsultantDetails newDetails = new ConsultantDetails();
                    newDetails.setConsultant(user); // do dùng @MapsId
                    return newDetails;
                });

        details.setSpecialization(dto.getSpecialization());
        details.setHireDate(dto.getHireDate());
        details.setYearsOfExperience(dto.getYearsOfExperience());

        consultantDetailsRepository.save(details);
    }


    public Page<BookingDTO> getAllConsultingBookings(Pageable pageable) {
        return bookingRepository.findAllConsultingBookings(pageable)
                .map(bookingMapper::toDTO);
    }



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

    public List<ConsultantDetailsDTO> findActiveConsultantsByServiceId(Long serviceId) {

        Services service = serviceRepository.findById(serviceId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Không tìm thấy dịch vụ"));

        String specialization = service.getSpecialization();

        List<ConsultantDetails> consultants =
                consultantDetailsRepository.findBySpecializationAndConsultant_IsActive(specialization, true);

        return consultants.stream()
                .map(ConsultantDetailsDTO::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public Long createConsultationBooking(ConsultationBookingCreateRequest req) {
        Services service = serviceRepository.findById(req.getServiceId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy dịch vụ"));

        ConsultantDetails consultant = null;
        if (req.getConsultantId() != null) {
            consultant = consultantDetailsRepository
                    .findByConsultant_UserIdAndConsultant_IsActive(req.getConsultantId(), true)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tư vấn viên không hợp lệ"));
        }

        User user = new User();
        user.setName(req.getCustomerName());
        user.setEmail(req.getCustomerEmail());
        user.setPhoneNumber(req.getCustomerPhone());
        user.setIsActive(true);
        user.setAuthProvider(AuthProvider.LOCAL);

        Role customerRole = roleRepository.findByName(RoleName.ROLE_CUSTOMER)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy role CUSTOMER"));
        user.setRole(customerRole);

        String defaultPassword = "123@Abcd";
        user.setPasswordHash(passwordEncoder.encode(defaultPassword));

        userRepository.save(user);


        CustomerDetails customer = new CustomerDetails();
        customer.setCustomer(user);
        customer.setFullName(req.getCustomerName());
        customer.setEmail(req.getCustomerEmail());
        customer.setPhoneNumber(req.getCustomerPhone());

        customer.setAge(req.getAge());
        customer.setGender(req.getGender());


        customerDetailsRepository.save(customer);

        Booking booking = new Booking();
        booking.setBookingDate(req.getBookingDate());
        booking.setTimeSlot(req.getTimeSlot());
        booking.setStatus(BookingStatus.PENDING_PAYMENT);
        booking.setServices(Set.of(service));
        booking.setConsultant(consultant);
        booking.setCustomer(customer);

        bookingRepository.save(booking);

        return booking.getBookingId();
    }




}
