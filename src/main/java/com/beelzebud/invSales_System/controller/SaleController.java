package com.beelzebud.invSales_System.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.beelzebud.invSales_System.dto.request.SaleRequestDTO;
import com.beelzebud.invSales_System.dto.response.SaleResponseDTO;
import com.beelzebud.invSales_System.service.SaleService;

import lombok.*;

@RestController
@RequestMapping("/api/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @PostMapping
    public ResponseEntity<SaleResponseDTO> registerSale(@RequestBody SaleRequestDTO request) {
        return ResponseEntity.ok(saleService.registerSale(request));
    }
    
}
