package com.beelzebud.invSales_System.controller;

import org.apache.catalina.connector.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.beelzebud.invSales_System.dto.request.LoginRequestDTO;
import com.beelzebud.invSales_System.dto.response.LoginResponseDTO;
import com.beelzebud.invSales_System.model.User;
import com.beelzebud.invSales_System.repository.UserRepository;
import com.beelzebud.invSales_System.security.JwtUtil;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO loginRequest) {
        User user = userRepository.findByUsername(loginRequest.getUsername())
        .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (!user.getPassword().equals(loginRequest.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().getName());
        
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
    
}
