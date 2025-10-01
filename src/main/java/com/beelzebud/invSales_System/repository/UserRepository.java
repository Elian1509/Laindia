package com.beelzebud.invSales_System.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.beelzebud.invSales_System.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
}
