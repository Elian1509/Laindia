package com.beelzebud.invSales_System.dto.request;

import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SaleRequestDTO {
    private Long userId; // el cajero/admin que hace la venta
    private List<SaleItemRequestDTO> items;
}
