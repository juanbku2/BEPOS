package mx.bepos.pos.web.controllers;

import lombok.RequiredArgsConstructor;
import mx.bepos.pos.services.ReportService;
import mx.bepos.pos.web.dto.reports.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/v1/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/cash-register-closure/{id}")
    public ResponseEntity<CashRegisterClosureReportDTO> getCashRegisterClosureReport(@PathVariable Long id) {
        return reportService.getCashRegisterClosureReport(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/sales-by-date")
    public List<SalesByDateReportDTO> getSalesByDateReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return reportService.getSalesByDateReport(startDate, endDate);
    }

    @GetMapping("/sales-by-product")
    public List<SalesByProductReportDTO> getSalesByProductReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return reportService.getSalesByProductReport(startDate, endDate);
    }

    @GetMapping("/sales-by-payment-method")
    public List<SalesByPaymentMethodReportDTO> getSalesByPaymentMethodReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return reportService.getSalesByPaymentMethodReport(startDate, endDate);
    }

    @GetMapping("/inventory-status")
    public List<CurrentInventoryStatusReportDTO> getCurrentInventoryStatusReport() {
        return reportService.getCurrentInventoryStatusReport();
    }

    @GetMapping("/inventory-movements")
    public List<InventoryMovementReportDTO> getInventoryMovementReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return reportService.getInventoryMovementReport(startDate, endDate);
    }

    @GetMapping("/sales-by-cashier")
    public List<SalesByCashierReportDTO> getSalesByCashierReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime endDate) {
        return reportService.getSalesByCashierReport(startDate, endDate);
    }

    @GetMapping("/cash-movements/{cashRegisterId}")
    public List<CashMovementReportDTO> getCashMovementReport(@PathVariable Long cashRegisterId) {
        return reportService.getCashMovementReport(cashRegisterId);
    }
}
