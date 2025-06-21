package com.ghsms.mapper;

import com.ghsms.DTO.BookingDTO;
import com.ghsms.model.Booking;
import org.springframework.stereotype.Component;

import java.util.stream.Collectors;

@Component
public class BookingMapper {

    public BookingDTO toDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();

        dto.setBookingId(booking.getBookingId());

        // Customer info
        if (booking.getCustomer() != null) {
            if (booking.getCustomer().getCustomer() != null) {
                dto.setUserId(booking.getCustomer().getCustomer().getUserId());
            }
            dto.setCustomerName(booking.getCustomer().getFullName());
            dto.setCustomerEmail(booking.getCustomer().getEmail());
            dto.setCustomerPhone(booking.getCustomer().getPhoneNumber());
            dto.setClient(booking.getCustomer().getFullName());
        }

        // Staff info
        if (booking.getStaff() != null && booking.getStaff().getStaff() != null) {
            dto.setStaffId(booking.getStaff().getStaff().getUserId());
            dto.setStaffName(booking.getStaff().getStaff().getName());
        }

        // Consultant info
        if (booking.getConsultant() != null && booking.getConsultant().getConsultant() != null) {
            dto.setConsultantId(booking.getConsultant().getConsultant().getUserId());
            dto.setConsultantName(booking.getConsultant().getConsultant().getName());
        }


        // Booking details
        dto.setBookingDate(booking.getBookingDate().toString());
        dto.setDate(dto.getBookingDate());
        dto.setTimeSlot(booking.getTimeSlot());

        // Time slot parsing
        String[] timeParts = booking.getTimeSlot().split("-");
        if (timeParts.length == 2) {
            dto.setStartTime(timeParts[0]);
            dto.setEndTime(timeParts[1]);
        }

        // Status and services
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

        return dto;
    }
}
