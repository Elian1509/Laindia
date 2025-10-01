package com.beelzebud.invSales_System.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                Map.of(
                        "type", "about:blank",
                        "title", "Recurso no encontrado",
                        "status", 404,
                        "errors", List.of(Map.of("detail", ex.getMessage())),
                        "timestamp", LocalDateTime.now()
                )
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGeneric(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                Map.of(
                        "type", "about:blank",
                        "title", "Recurso no encontrado",
                        "status", 404,
                        "errors", List.of(Map.of("detail", ex.getMessage())),
                        "timestamp", LocalDateTime.now()
                )
        );
    }
}
