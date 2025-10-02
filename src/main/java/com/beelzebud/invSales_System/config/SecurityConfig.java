package com.beelzebud.invSales_System.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf().disable() 
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/**").permitAll() 
                .anyRequest().authenticated() 
            )
            .httpBasic(Customizer.withDefaults())
            .formLogin(form -> form.disable()); 
        return http.build();
    }
}
