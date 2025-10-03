package com.beelzebud.invSales_System.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "sale_items")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Pk

    @ManyToOne
    @JoinColumn(name = "sale_id", nullable = false)
    private Sale sale; // FK de Sale

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product; // FK de Product

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal priceUnit;

    @Column(name = "subtotal", nullable = false, precision = 10, scale = 2)
    private BigDecimal subTotal;

}
