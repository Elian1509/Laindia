package com.beelzebud.invSales_System.service;

import java.time.LocalDate;

import org.springframework.core.io.Resource;

import com.beelzebud.invSales_System.dto.response.DailyReportResponseDTO;

public interface ReportService {
    DailyReportResponseDTO getDailyReport(LocalDate date);
    Resource exportDailyReportToCSV(LocalDate date);
    Resource exportDailyReportToPdf(LocalDate date);

}
