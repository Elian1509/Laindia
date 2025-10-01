package com.beelzebud.invSales_System.service;

import com.beelzebud.invSales_System.dto.request.ProductRequestDTO;
import com.beelzebud.invSales_System.dto.response.ProductResponseDTO;

import java.util.List;

public interface ProductService {

    ProductResponseDTO createProduct(ProductRequestDTO request);

    List<ProductResponseDTO> getAllProducts();

    ProductResponseDTO getProductById(Long id);

    ProductResponseDTO updateProduct(Long id, ProductRequestDTO request);

    void deleteProduct(Long id);
}
