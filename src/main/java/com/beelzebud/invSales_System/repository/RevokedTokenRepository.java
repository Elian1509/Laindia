package com.beelzebud.invSales_System.repository;

import com.beelzebud.invSales_System.model.RevokedToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RevokedTokenRepository extends JpaRepository<RevokedToken, Long> {
    boolean existsByToken(String token);
}
