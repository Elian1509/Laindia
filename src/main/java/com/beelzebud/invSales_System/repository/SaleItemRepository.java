package com.beelzebud.invSales_System.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.beelzebud.invSales_System.model.SaleItem;

public interface SaleItemRepository extends JpaRepository<SaleItem, Long> {
}
