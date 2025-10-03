package com.beelzebud.invSales_System.dto.request;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleItemRequestDTO {
    private Long productId;
    private Integer quantity;
}
