package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import mx.bepos.pos.domain.repositories.reports.*;
import mx.bepos.pos.web.dto.reports.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ReportService {

    private final CashRegisterClosureReportRepository cashRegisterClosureReportRepository;
    private final SalesByDateReportRepository salesByDateReportRepository;
    private final SalesByProductReportRepository salesByProductReportRepository;
    private final SalesByPaymentMethodReportRepository salesByPaymentMethodReportRepository;
    private final CurrentInventoryStatusReportRepository currentInventoryStatusReportRepository;
    private final InventoryMovementReportRepository inventoryMovementReportRepository;
    private final SalesByCashierReportRepository salesByCashierReportRepository;
    private final CashMovementReportRepository cashMovementReportRepository;

    public Optional<CashRegisterClosureReportDTO> getCashRegisterClosureReport(Long cashRegisterId) {
        return cashRegisterClosureReportRepository.getCashRegisterClosureReport(cashRegisterId);
    }

    public List<SalesByDateReportDTO> getSalesByDateReport(LocalDateTime startDate, LocalDateTime endDate) {
        return salesByDateReportRepository.getSalesByDateReport(startDate, endDate);
    }

    public List<SalesByProductReportDTO> getSalesByProductReport(LocalDateTime startDate, LocalDateTime endDate) {
        return salesByProductReportRepository.getSalesByProductReport(startDate, endDate);
    }

    public List<SalesByPaymentMethodReportDTO> getSalesByPaymentMethodReport(LocalDateTime startDate, LocalDateTime endDate) {
        return salesByPaymentMethodReportRepository.getSalesByPaymentMethodReport(startDate, endDate);
    }

    public List<CurrentInventoryStatusReportDTO> getCurrentInventoryStatusReport() {
        return currentInventoryStatusReportRepository.getCurrentInventoryStatusReport();
    }

    public List<InventoryMovementReportDTO> getInventoryMovementReport(LocalDateTime startDate, LocalDateTime endDate) {
        return inventoryMovementReportRepository.getInventoryMovementReport(startDate, endDate);
    }

    public List<SalesByCashierReportDTO> getSalesByCashierReport(LocalDateTime startDate, LocalDateTime endDate) {
        return salesByCashierReportRepository.getSalesByCashierReport(startDate, endDate);
    }

    public List<CashMovementReportDTO> getCashMovementReport(Long cashRegisterId) {
        return cashMovementReportRepository.getCashMovementReport(cashRegisterId);
    }
}
