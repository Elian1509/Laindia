package com.beelzebud.invSales_System.controller;

import java.time.LocalDate;

import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.beelzebud.invSales_System.dto.response.DailyReportResponseDTO;
import com.beelzebud.invSales_System.service.ReportService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

        private final ReportService reportService;

        @GetMapping("/daily")
        public ResponseEntity<DailyReportResponseDTO> getDailyReport(
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
                DailyReportResponseDTO report = reportService.getDailyReport(date);
                return ResponseEntity.ok(report);
        }

        @GetMapping("/daily/csv")
        public ResponseEntity<Resource> getDailyReportCsv(
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

                Resource csvFile = reportService.exportDailyReportToCSV(date);

                return ResponseEntity.ok()
                                .header(HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=report_" + date + ".csv")
                                .contentType(MediaType.parseMediaType("text/csv"))
                                .body(csvFile);
        }

        @GetMapping("/daily/pdf")
        public ResponseEntity<Resource> getDailyReportPdf(
                        @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

                Resource pdfFile = reportService.exportDailyReportToPdf(date);

                return ResponseEntity.ok()
                                .header(HttpHeaders.CONTENT_DISPOSITION,
                                                "attachment; filename=report_" + date + ".pdf")
                                .contentType(MediaType.APPLICATION_PDF)
                                .body(pdfFile);
        }
}
