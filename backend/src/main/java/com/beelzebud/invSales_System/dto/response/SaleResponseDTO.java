package com.beelzebud.invSales_System.dto.response;

import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleResponseDTO {
    private UUID transactionNumber;
    private LocalDateTime createdAt;
    private BigDecimal total;
    private List<SaleItemResponseDTO> items;
}
