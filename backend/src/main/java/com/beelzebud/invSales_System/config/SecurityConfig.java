package com.beelzebud.invSales_System.config;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.stereotype.Component;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.beelzebud.invSales_System.security.JwtAuthenticationFilter;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@EnableMethodSecurity
@Configuration
@RequiredArgsConstructor
public class SecurityConfig {

        private final JwtAuthenticationFilter jwtAuthFilter;

        @Bean
        public SecurityFilterChain securityFilterChain(HttpSecurity http,
                        JwtAuthenticationFilter jwtAuthFilter,
                        CustomAuthHandlers customAuthHandlers) throws Exception {
                return http
                                .csrf(csrf -> csrf.disable())
                                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                                .authorizeHttpRequests(auth -> auth
                                                .requestMatchers("/api/auth/**").permitAll()
                                                .requestMatchers(HttpMethod.POST, "/api/user/**").hasRole("ADMIN")
                                                .requestMatchers("/api/products/**").hasRole("ADMIN") // CRUD
                                                .requestMatchers(HttpMethod.GET, "/api/products/**")
                                                .hasAnyRole("ADMIN", "CASHIER")
                                                .requestMatchers("/api/sales/**").hasAnyRole("ADMIN", "CASHIER")
                                                .requestMatchers("/api/reports/**").hasRole("ADMIN")
                                                .anyRequest().authenticated())
                                .exceptionHandling(ex -> ex
                                                .authenticationEntryPoint(customAuthHandlers) // 401
                                                .accessDeniedHandler(customAuthHandlers) // 403
                                )
                                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                                .build();
        }

        @Bean
        public PasswordEncoder passwordEncoder() {
                return new BCryptPasswordEncoder();
        }

        @Bean
        public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
                        throws Exception {
                return authenticationConfiguration.getAuthenticationManager();
        }

        @Bean
        public CorsConfigurationSource corsConfigurationSource() {
                CorsConfiguration config = new CorsConfiguration();
                config.addAllowedOrigin("http://localhost:5173"); // tu front
                config.addAllowedMethod("*"); // GET, POST, PUT, DELETE, OPTIONS
                config.addAllowedHeader("*");
                config.setAllowCredentials(true);

                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/api/**", config);
                return source;
        }

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
                                        "errors",
                                        new Object[] { Map.of("detail", detail, "status", response.getStatus()) },
                                        "timestamp", LocalDateTime.now());
                        new ObjectMapper().writeValue(response.getOutputStream(), body);
                }

                @Override
                public void commence(HttpServletRequest request, HttpServletResponse response,
                                org.springframework.security.core.AuthenticationException authException)
                                throws IOException {
                        writeResponse(response, HttpStatus.UNAUTHORIZED.value(),
                                        "No autenticado", authException.getMessage());
                }

                @Override
                public void handle(HttpServletRequest request, HttpServletResponse response,
                                AccessDeniedException accessDeniedException) throws IOException {
                        writeResponse(response, HttpStatus.FORBIDDEN.value(),
                                        "Acceso denegado", accessDeniedException.getMessage());
                }
        }
}
