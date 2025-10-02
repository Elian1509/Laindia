package com.beelzebud.invSales_System.service;

import com.beelzebud.invSales_System.dto.request.SaleRequestDTO;
import com.beelzebud.invSales_System.dto.response.SaleResponseDTO;

public interface SaleService {

    // Registrar una venta y devolver info completa
    SaleResponseDTO createSale(SaleRequestDTO request);

    // obtener venta por ID o transacción
    SaleResponseDTO getSaleById(Long id);
}
