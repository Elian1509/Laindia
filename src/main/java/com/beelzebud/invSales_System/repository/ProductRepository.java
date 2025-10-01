package com.beelzebud.invSales_System.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.beelzebud.invSales_System.model.Product;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findBySku(String sku);
}
