package com.beelzebud.invSales_System.service.impl;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.beelzebud.invSales_System.dto.request.SaleItemRequestDTO;
import com.beelzebud.invSales_System.dto.request.SaleRequestDTO;
import com.beelzebud.invSales_System.dto.response.SaleItemResponseDTO;
import com.beelzebud.invSales_System.dto.response.SaleResponseDTO;
import com.beelzebud.invSales_System.exception.ResourceNotFoundException;
import com.beelzebud.invSales_System.exception.StockException;
import com.beelzebud.invSales_System.model.Product;
import com.beelzebud.invSales_System.model.Sale;
import com.beelzebud.invSales_System.model.SaleItem;
import com.beelzebud.invSales_System.model.User;
import com.beelzebud.invSales_System.repository.ProductRepository;
import com.beelzebud.invSales_System.repository.SaleItemRepository;
import com.beelzebud.invSales_System.repository.SaleRepository;
import com.beelzebud.invSales_System.repository.UserRepository;
import com.beelzebud.invSales_System.service.SaleService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class SaleServiceImpl implements SaleService {

        private final SaleRepository saleRepository;
        private final SaleItemRepository saleItemRepository;
        private final ProductRepository productRepository;
        private final UserRepository userRepository;

        @Override
        @Transactional
        public SaleResponseDTO registerSale(SaleRequestDTO request) {

                List<String> stockErrors = new ArrayList<>();
                List<SaleItemResponseDTO> itemResponses = new ArrayList<>();
                BigDecimal total = BigDecimal.ZERO;
                List<SaleItem> saleItems = new ArrayList<>();

                // Validar usuario
                User user = userRepository.findById(request.getUserId())
                                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));

                // Crear cabecera de la venta
                Sale sale = Sale.builder()
                                .transactionNumber(UUID.randomUUID())
                                .user(user)
                                .createdAt(LocalDateTime.now())
                                .total(BigDecimal.ZERO)
                                .build();
                sale = saleRepository.save(sale);

                // recorre los items
                for (SaleItemRequestDTO itemReq : request.getItems()) {
                        Product product = productRepository.findById(itemReq.getProductId())
                                        .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

                        if (product.getStock() < itemReq.getQuantity()) {
                                stockErrors.add("El producto: " + product.getName()
                                                + " no tiene stock suficiente. Stock actual: " + product.getStock());
                                continue;
                        }

                        // Reducir stock
                        product.setStock(product.getStock() - itemReq.getQuantity());
                        productRepository.save(product);

                        // Calcular subtotal
                        BigDecimal subTotal = product.getPrice().multiply(BigDecimal.valueOf(itemReq.getQuantity()));

                        // Crear saleItem
                        SaleItem saleItem = SaleItem.builder()
                                        .sale(sale)
                                        .product(product)
                                        .quantity(itemReq.getQuantity())
                                        .priceUnit(product.getPrice())
                                        .subTotal(subTotal)
                                        .build();
                        saleItemRepository.save(saleItem);

                        // Acumular total
                        total = total.add(subTotal);

                        // Armar respuesta
                        itemResponses.add(
                                        SaleItemResponseDTO.builder()
                                                        .productName(product.getName())
                                                        .quantity(itemReq.getQuantity())
                                                        .priceUnit(product.getPrice())
                                                        .subTotal(subTotal)
                                                        .build());
                }

                if (!stockErrors.isEmpty()) {
                        throw new StockException(stockErrors);
                }

                // Actualizar total de la venta
                sale.setTotal(total);
                saleRepository.save(sale);

                // Devolver DTO de respuesta
                return SaleResponseDTO.builder()
                                .transactionNumber(sale.getTransactionNumber())
                                .createdAt(sale.getCreatedAt())
                                .total(sale.getTotal())
                                .items(itemResponses)
                                .build();
        }
}
