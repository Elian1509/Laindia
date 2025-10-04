package com.beelzebud.invSales_System.controller;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.beelzebud.invSales_System.dto.request.LoginRequestDTO;
import com.beelzebud.invSales_System.dto.response.LoginResponseDTO;
import com.beelzebud.invSales_System.model.LoginAttempt;
import com.beelzebud.invSales_System.model.RevokedToken;
import com.beelzebud.invSales_System.model.User;
import com.beelzebud.invSales_System.repository.LoginAttemptRepository;
import com.beelzebud.invSales_System.repository.RevokedTokenRepository;
import com.beelzebud.invSales_System.repository.UserRepository;
import com.beelzebud.invSales_System.security.JwtUtil;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final PasswordEncoder passwordEncoder;
    private final LoginAttemptRepository loginAttemptRepository;
    private final RevokedTokenRepository revokedTokenRepository;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request, HttpServletRequest httpReq) {
        String ip = httpReq.getRemoteAddr();
        String ua = httpReq.getHeader("User-Agent");

        Optional<User> opt = userRepository.findByUsername(request.getUsername());
        if (opt.isEmpty()) {
            loginAttemptRepository.save(LoginAttempt.builder()
                    .username(request.getUsername())
                    .success(false)
                    .ip(ip)
                    .userAgent(ua)
                    .createdAt(LocalDateTime.now())
                    .build());
            throw new BadCredentialsException("Usuario no encontrado");
        }
        User user = opt.get();

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            loginAttemptRepository.save(LoginAttempt.builder()
                    .username(request.getUsername())
                    .success(false)
                    .ip(ip)
                    .userAgent(ua)
                    .createdAt(LocalDateTime.now())
                    .build());
            throw new BadCredentialsException("Credenciales inválidas");
        }

        // correcto
        loginAttemptRepository.save(LoginAttempt.builder()
                .username(user.getUsername())
                .success(true)
                .ip(ip)
                .userAgent(ua)
                .createdAt(LocalDateTime.now())
                .build());
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().getName(), user.getId());
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.noContent().build();
        }
        String token = authHeader.substring(7);

        // extrae expiracion desde JwtUtil
        Instant expInstant = jwtUtil.extractExpirationInstant(token);
        LocalDateTime expiresAt = LocalDateTime.ofInstant(expInstant, ZoneId.systemDefault());

        revokedTokenRepository.save(RevokedToken.builder()
                .token(token)
                .expiresAt(expiresAt)
                .createdAt(LocalDateTime.now())
                .build());

        return ResponseEntity.ok().build();
    }
}