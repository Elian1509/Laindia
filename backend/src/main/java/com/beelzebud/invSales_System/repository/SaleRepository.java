package com.beelzebud.invSales_System.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.beelzebud.invSales_System.model.Sale;

public interface SaleRepository extends JpaRepository<Sale, Long> {
    List<Sale> findByCreatedAtBetween(java.time.LocalDateTime start, java.time.LocalDateTime end);
}
