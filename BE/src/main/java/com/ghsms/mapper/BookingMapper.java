package com.ghsms.mapper;

import com.ghsms.DTO.BookingDTO;
import com.ghsms.DTO.ConsultationBookingUpdateRequest;
import com.ghsms.DTO.TestResultDTO;
import com.ghsms.file_enum.ConsultationStatus;
import com.ghsms.model.*;
import org.springframework.stereotype.Component;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class BookingMapper {

    public BookingDTO toDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();

        dto.setBookingId(booking.getBookingId());

        if (booking.getCustomer() != null) {
            if (booking.getCustomer().getCustomer() != null) {
                dto.setUserId(booking.getCustomer().getCustomer().getUserId());
            }
            dto.setCustomerName(booking.getCustomer().getFullName());
            dto.setCustomerEmail(booking.getCustomer().getEmail());
            dto.setCustomerPhone(booking.getCustomer().getPhoneNumber());
            dto.setCustomerAge(booking.getCustomer().getAge());
            dto.setCustomerGender(booking.getCustomer().getGender());
            dto.setClient(booking.getCustomer().getFullName());
        }

        if (booking.getStaff() != null && booking.getStaff().getStaff() != null) {
            dto.setStaffId(booking.getStaff().getStaff().getUserId());
            dto.setStaffName(booking.getStaff().getStaff().getName());
        }

        if (booking.getConsultant() != null && booking.getConsultant().getConsultant() != null) {
            dto.setConsultantId(booking.getConsultant().getConsultant().getUserId());
            dto.setConsultantName(booking.getConsultant().getConsultant().getName());
        }
        dto.setBookingDate(booking.getBookingDate().toString());
        dto.setDate(dto.getBookingDate());
        dto.setTimeSlot(booking.getTimeSlot());
        String[] timeParts = booking.getTimeSlot().split("-");
        if (timeParts.length == 2) {
            dto.setStartTime(timeParts[0]);
            dto.setEndTime(timeParts[1]);
        }

        dto.setStatus(booking.getStatus());
        if (!booking.getServices().isEmpty()) {
            dto.setCategory(booking.getServices().iterator().next().getCategory());
            dto.setServiceIds(booking.getServices().stream()
                    .map(service -> service.getServiceId())
                    .collect(Collectors.toList()));
            dto.setServiceName(booking.getServices().stream()
                    .map(service -> service.getServiceName())
                    .collect(Collectors.joining(", ")));
        }
        if (booking.getConsultation() != null) {
            dto.setConsultationId(booking.getConsultation().getConsultationId());
            dto.setConsultationStatus(booking.getConsultation().getStatus());
            dto.setNote(booking.getConsultation().getNote());
        }

        if (booking.getTestResults() != null && !booking.getTestResults().isEmpty()) {
            TestResult firstResult = booking.getTestResults().iterator().next();
            dto.setTestResultId(firstResult.getTestResultId());
            dto.setTestStatus(firstResult.getStatus());
            dto.setNote(firstResult.getNotes());
        }

        if (booking.getTestResults() != null) {
            dto.setTestResults(
                    booking.getTestResults().stream()
                            .map(this::toTestResultDTO)
                            .collect(Collectors.toList())
            );
        }


        return dto;
    }

    public TestResultDTO toTestResultDTO(TestResult entity) {
        TestResultDTO dto = new TestResultDTO();

        dto.setTestResultId(entity.getTestResultId());
        dto.setBookingId(entity.getBooking().getBookingId());
        dto.setTestName(entity.getTestName());
        dto.setResult(entity.getResult());
        dto.setStatus(entity.getStatus());
        dto.setGeneratedAt(entity.getGeneratedAt());
        dto.setScheduledTime(entity.getScheduledTime());
        dto.setEstimatedCompletionTime(entity.getEstimatedCompletionTime());
        dto.setCurrentPhase(entity.getCurrentPhase());
        dto.setProgressPercentage(entity.getProgressPercentage());
        dto.setLastUpdated(entity.getLastUpdated());
        dto.setNotes(entity.getNotes());
        dto.setFormat(entity.getFormat());

        if (entity.getBooking() != null && entity.getBooking().getCustomer() != null) {
            var customer = entity.getBooking().getCustomer();
            dto.setCustomerName(customer.getFullName());
            dto.setCustomerAge(customer.getAge());
            dto.setCustomerGender(customer.getGender());
            dto.setCustomerEmail(customer.getEmail());
            dto.setCustomerPhone(customer.getPhoneNumber());
        }

        if (entity.getBooking() != null && entity.getBooking().getStaff() != null) {
            StaffDetails staffDetails = entity.getBooking().getStaff();
            if (staffDetails.getStaff() != null) {
                dto.setStaffName(staffDetails.getStaff().getName());
                if (staffDetails.getSpecialization() != null) {
                    dto.setStaffSpecialty(staffDetails.getSpecialization());
                }
            }
        }

        return dto;
    }


    public void updateFromConsultationDTO(
            Booking booking,
            ConsultationBookingUpdateRequest req,
            Services service,
            ConsultantDetails consultant
    ) {
        String oldDate = booking.getBookingDate();
        String oldTimeSlot = booking.getTimeSlot();

        booking.setBookingDate(req.getBookingDate());
        booking.setTimeSlot(req.getTimeSlot());
        booking.setServices(new HashSet<>(List.of(service)));
        booking.setConsultant(consultant);
        if (booking.getCustomer() != null) {
            booking.getCustomer().setFullName(req.getCustomerName());
            booking.getCustomer().setPhoneNumber(req.getCustomerPhone());
        }

        Consultation consultation = booking.getConsultation();
        if (consultation != null) {
            boolean dateChanged = !Objects.equals(oldDate, req.getBookingDate());
            boolean timeChanged = !Objects.equals(oldTimeSlot, req.getTimeSlot());

            if (dateChanged || timeChanged) {
                consultation.setStatus(ConsultationStatus.SCHEDULED);
                consultation.setDateScheduled(req.getBookingDate());
                consultation.setTimeSlot(req.getTimeSlot());
            }
        }

        if (req.getStatus() != null) {
            booking.setStatus(req.getStatus());
        }

        if (consultation != null && req.getConsultationStatus() != null) {
            consultation.setStatus(req.getConsultationStatus());
        }


    }


}


