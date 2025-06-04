package com.ghsms.controller;

import com.ghsms.DTO.BookingDTO;
import com.ghsms.file_enum.BookingStatus;
import com.ghsms.file_enum.ServiceBookingCategory;
import com.ghsms.model.Booking;
import com.ghsms.model.Service;
import com.ghsms.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Booking", description = "Booking management APIs")
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {
    private final BookingService bookingService;

    @PostMapping
    @Operation(summary = "Create a new booking")
    public ResponseEntity<?> createBooking(@Valid @RequestBody BookingDTO bookingDTO) {
        try {
            Booking booking = bookingService.createBooking(
                    bookingDTO.getUserId(),
                    bookingDTO.getServiceIds(),
                    bookingDTO.getBookingDate(),
                    bookingDTO.getTimeSlot()
            );

            BookingDTO response = convertToDTO(booking);
            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Booking created successfully",
                            "booking", response,
                            "paymentCode", booking.getPaymentCode()
                    ));

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        }
    }

    @GetMapping("/payment/{paymentCode}")
    @Operation(summary = "Get booking by payment code")
    public ResponseEntity<?> getBookingByPaymentCode(@PathVariable String paymentCode) {
        try {
            Booking booking = bookingService.findByPaymentCode(paymentCode);
            return ResponseEntity.ok(convertToDTO(booking));
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        }
    }


    @GetMapping("/user/{userId}")
    @Operation(summary = "Get all bookings for a user")
    public ResponseEntity<List<BookingDTO>> getUserBookings(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getUserBookings(userId);
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookingDTOs);
    }

    @GetMapping("/category/{category}")
    @Operation(summary = "Get bookings by service category")
    public ResponseEntity<List<BookingDTO>> getBookingsByCategory(
            @PathVariable ServiceBookingCategory category,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) String date) {
        List<Booking> bookings = date != null ?
                bookingService.getBookingsByCategoryAndDate(category, date) :
                bookingService.getBookingsByCategory(category);
        List<BookingDTO> bookingDTOs = bookings.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(bookingDTOs);
    }

    @PatchMapping("/{bookingId}/status")
    @Operation(summary = "Update booking status")
    public ResponseEntity<?> updateBookingStatus(
            @PathVariable Long bookingId,
            @RequestParam BookingStatus status) {
        try {
            if (status == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Booking status cannot be null"));
            }

            Booking booking = bookingService.updateBookingStatus(bookingId, status);
            BookingDTO updatedBooking = convertToDTO(booking);

            return ResponseEntity.ok()
                    .body(Map.of(
                            "message", "Booking status updated successfully",
                            "booking", updatedBooking
                    ));

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode())
                    .body(Map.of("error", e.getReason()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error updating booking status: " + e.getMessage()));
        }
    }

    private BookingDTO convertToDTO(Booking booking) {
        BookingDTO dto = new BookingDTO();
        dto.setBookingId(booking.getBookingId());
        dto.setUserId(booking.getCustomer().getUserId());

        // Get the first service for backward compatibility
        Service primaryService = booking.getServices().iterator().next();
        dto.setServiceIds(List.of(primaryService.getServiceId()));
        dto.setServiceName(primaryService.getServiceName());
        dto.setCategory(primaryService.getCategory());

        dto.setBookingDate(booking.getBookingDate());
        dto.setTimeSlot(booking.getTimeSlot());
        dto.setStatus(booking.getStatus());
        dto.setCustomerName(booking.getCustomer().getName());

        // Add additional services information
        dto.setServiceIds(booking.getServices().stream()
                .map(Service::getServiceId)
                .collect(Collectors.toList()));
        dto.setPaymentCode(booking.getPaymentCode());
        return dto;
    }
}