package com.beelzebud.invSales_System.service.impl;

import com.beelzebud.invSales_System.dto.request.ProductRequestDTO;
import com.beelzebud.invSales_System.dto.response.ProductResponseDTO;
import com.beelzebud.invSales_System.model.Product;
import com.beelzebud.invSales_System.repository.ProductRepository;
import com.beelzebud.invSales_System.service.ProductService;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;


    private ProductResponseDTO mapToDTO(Product product) {
    return ProductResponseDTO.builder()
            .id(product.getId())
            .sku(product.getSku())
            .name(product.getName())
            .description(product.getDescription())
            .price(product.getPrice())
            .stock(product.getStock())
            .build();
}

    // Crear producto
    @Override
    public ProductResponseDTO createProduct(ProductRequestDTO request) {
        // Convertir DTO a Entidad
        Product product = Product.builder()
                .sku(request.getSku())
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .build();

        // Guardar en la BD
        Product saved = productRepository.save(product);

        // Convertir Entidad a DTO de respuesta
        return mapToDTO(saved);
    }

    // Obtener todos los productos
    @Override
    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    // Obtener producto por ID
    @Override
    public ProductResponseDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        return mapToDTO(product);
    }

    // Actualizar producto
    @Override
    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        // Actualizar campos
        product.setSku(request.getSku());
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());

        // Guardar cambios
        Product updated = productRepository.save(product);

        return mapToDTO(updated);
    }
    // Eliminar producto
    @Override
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));
        productRepository.delete(product);
    }

}
