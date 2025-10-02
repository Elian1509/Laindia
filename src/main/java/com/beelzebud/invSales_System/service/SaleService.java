package com.beelzebud.invSales_System.service;

import com.beelzebud.invSales_System.dto.request.SaleRequestDTO;
import com.beelzebud.invSales_System.dto.response.SaleResponseDTO;

public interface SaleService {
    SaleResponseDTO registerSale(SaleRequestDTO request);
}
