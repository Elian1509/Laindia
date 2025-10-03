package com.beelzebud.invSales_System.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@Component
public class CustomAuthHandlers implements AuthenticationEntryPoint, AccessDeniedHandler {

    private void writeResponse(HttpServletResponse response, int status, String title, String detail)
            throws IOException {
        response.setStatus(status);
        response.setContentType("application/json");
        Map<String, Object> body = Map.of(
                "type", "about:blank",
                "title", title,
                "status", status,
                "errors", new Object[] { Map.of("detail", detail) },
                "timestamp", LocalDateTime.now());
        new ObjectMapper().writeValue(response.getOutputStream(), body);
    }

    // Para 401 (no autenticado)
    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
            org.springframework.security.core.AuthenticationException authException) throws IOException {
        writeResponse(response, HttpStatus.UNAUTHORIZED.value(),
                "No autenticado", authException.getMessage());
    }

    // Para 403 (sin permisos)
    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response,
            AccessDeniedException accessDeniedException) throws IOException {
        writeResponse(response, HttpStatus.FORBIDDEN.value(),
                "Acceso denegado", accessDeniedException.getMessage());
    }
}
