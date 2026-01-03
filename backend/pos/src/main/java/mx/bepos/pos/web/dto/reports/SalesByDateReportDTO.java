package mx.bepos.pos.web.dto.reports;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class SalesByDateReportDTO {
    private LocalDate saleDay;
    private Long totalTickets;
    private BigDecimal totalSales;
}
