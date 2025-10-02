package com.beelzebud.invSales_System.dto.response;

import lombok.*;
import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleItemResponseDTO {
    private String productName;
    private Integer quantity;
    private BigDecimal priceUnit;
    private BigDecimal subTotal;
}
