package com.beelzebud.invSales_System.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.beelzebud.invSales_System.model.LoginAttempt;

public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, Long> {
    Optional<LoginAttempt> findTopByUsernameOrderByCreatedAtDesc(String username);
}
