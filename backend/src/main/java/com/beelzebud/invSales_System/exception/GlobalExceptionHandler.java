package com.beelzebud.invSales_System.exception;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import jakarta.servlet.http.HttpServletRequest;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(
            ResourceNotFoundException ex,
            HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of(
                        "type", "about:blank",
                        "title", "Recurso no encontrado",
                        "status", 404,
                        "detail", ex.getMessage(),
                        "instance", request.getRequestURI(),
                        "timestamp", LocalDateTime.now()));
    }
    // Mal commit

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of(
                        "type", "about:blank",
                        "title", "Error interno del servidor",
                        "status", 500,
                        "errors", List.of(Map.of("detail", ex.getMessage())),
                        "timestamp", LocalDateTime.now()));
    }

    @ExceptionHandler(StockException.class)
    public ResponseEntity<Map<String, Object>> handleStockException(StockException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                Map.of(
                        "type", "about:blank",
                        "title", "Error en stock",
                        "status", 400,
                        "errors", ex.getErrors().stream()
                                .map(err -> Map.of("detail", err))
                                .toList(),
                        "timestamp", LocalDateTime.now()));
    }

}
