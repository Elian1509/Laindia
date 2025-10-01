package com.beelzebud.invSales_System.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.beelzebud.invSales_System.model.Role;

public interface RoleRepository extends JpaRepository<Role, Long> {
    Optional<Role> findByName(String name);
}

