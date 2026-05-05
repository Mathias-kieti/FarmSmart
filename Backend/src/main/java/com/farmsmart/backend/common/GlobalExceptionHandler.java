package com.farmsmart.backend.common;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ApiException.class)
    public ResponseEntity<Map<String, String>> handleApiException(ApiException exception) {
        return ResponseEntity
                .status(exception.getStatus())
                .body(Map.of("message", exception.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidation(MethodArgumentNotValidException exception) {
        Map<String, String> errors = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .collect(
                        java.util.stream.Collectors.toMap(
                                FieldError::getField,
                                fieldError -> fieldError.getDefaultMessage() == null
                                        ? "Invalid value"
                                        : fieldError.getDefaultMessage(),
                                (left, right) -> left));

        return ResponseEntity
                .badRequest()
                .body(Map.of("message", "Invalid request data", "errors", errors));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleUnexpected(Exception exception) {
        exception.printStackTrace();
        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Internal server error"));
    }
}
