package com.beelzebud.invSales_System.service.impl;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import com.beelzebud.invSales_System.dto.response.DailyReportItemDTO;
import com.beelzebud.invSales_System.dto.response.DailyReportResponseDTO;
import com.beelzebud.invSales_System.model.Sale;
import com.beelzebud.invSales_System.model.SaleItem;
import com.beelzebud.invSales_System.repository.SaleRepository;
import com.beelzebud.invSales_System.service.ReportService;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    private final SaleRepository saleRepository;

    @Override
    public DailyReportResponseDTO getDailyReport(LocalDate date) {
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(23, 59, 59);

       List<Sale> sales = saleRepository.findByCreatedAtBetween(start, end);

       int totalSales = sales.size();
       BigDecimal totalAmount = BigDecimal.ZERO;
       Map<String, DailyReportItemDTO> itemsMap = new HashMap<>();

       for (Sale sale : sales) {
           totalAmount = totalAmount.add(sale.getTotal());

           for (SaleItem item : sale.getSaleItems()) {
               DailyReportItemDTO reportItem = itemsMap.getOrDefault(
                item.getProduct().getName(), 
                new DailyReportItemDTO(item.getProduct().getName(), 0, BigDecimal.ZERO)
            );
            
            
            int newQuantity = reportItem.getQuantity() + item.getQuantity();
            BigDecimal newTotal = reportItem.getTotal()
            .add(item.getSubTotal());

            reportItem.setQuantity(newQuantity);
            reportItem.setTotal(newTotal);

            itemsMap.put(item.getProduct().getName(), reportItem);
        }

    }

    return DailyReportResponseDTO.builder()
        .date(date)
        .totalSales(totalSales)
        .totalAmount(totalAmount)
        .items(new ArrayList<>(itemsMap.values()))
        .build();
    }

    @Override
    public Resource exportDailyReportToCSV(LocalDate date) {
        DailyReportResponseDTO report = getDailyReport(date);

        StringBuilder sb = new StringBuilder();
        sb.append("Fecha,Total Ventas,Monto\n");

        sb.append(report.getDate()).append(",")
          .append(report.getTotalSales()).append(",")
          .append(report.getTotalAmount()).append("\n\n");

        sb.append("Producto,Cantidad,Total\n");
        for (DailyReportItemDTO item : report.getItems()) {
            sb.append(item.getProductName()).append(",")
              .append(item.getQuantity()).append(",")
              .append(item.getTotal()).append("\n");
        }

       byte[] bytes = sb.toString().getBytes(StandardCharsets.UTF_8);
       return new ByteArrayResource(bytes); 
    }

    @Override
    public Resource exportDailyReportToPdf(LocalDate date) {
    DailyReportResponseDTO report = getDailyReport(date);

    try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);
        document.open();

        // Título
        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
        Paragraph title = new Paragraph("Reporte Diario - " + report.getDate(), titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(Chunk.NEWLINE);

        // Totales
        document.add(new Paragraph("Total Ventas: " + report.getTotalSales()));
        document.add(new Paragraph("Monto Total: $" + report.getTotalAmount()));
        document.add(Chunk.NEWLINE);

        // Tabla de items
        PdfPTable table = new PdfPTable(3);
        table.setWidthPercentage(100);
        table.setWidths(new int[]{5, 2, 3});

        PdfPCell h1 = new PdfPCell(new Phrase("Producto"));
        PdfPCell h2 = new PdfPCell(new Phrase("Cantidad"));
        PdfPCell h3 = new PdfPCell(new Phrase("Total"));
        h1.setBackgroundColor(Color.LIGHT_GRAY);
        h2.setBackgroundColor(Color.LIGHT_GRAY);
        h3.setBackgroundColor(Color.LIGHT_GRAY);
        table.addCell(h1);
        table.addCell(h2);
        table.addCell(h3);

        for (DailyReportItemDTO item : report.getItems()) {
            table.addCell(item.getProductName());
            table.addCell(String.valueOf(item.getQuantity()));
            table.addCell("$" + item.getTotal());
        }

        document.add(table);
        document.close();

        return new ByteArrayResource(out.toByteArray());
    } catch (Exception e) {
        throw new RuntimeException("Error generando PDF", e);
    }
}
}
