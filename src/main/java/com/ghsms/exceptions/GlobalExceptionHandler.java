package com.ghsms.exceptions;

import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<?> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(err -> {
            errors.put(err.getField(), err.getDefaultMessage());
        });
        return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(errors);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<?> handleConstraintViolationException(ConstraintViolationException ex) {
        return ResponseEntity.badRequest()
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", "Dữ liệu không hợp lệ: " + ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<?> handleAllExceptions(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .contentType(MediaType.APPLICATION_JSON)
                .body(Map.of("error", "Lỗi hệ thống: " + ex.getMessage()));
    }
}