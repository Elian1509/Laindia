package com.beelzebud.invSales_System.dto.response;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyReportResponseDTO {
    private LocalDate date;
    private int totalSales;
    private BigDecimal totalAmount;
    private List<DailyReportItemDTO> items;
}
