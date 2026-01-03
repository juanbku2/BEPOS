package mx.bepos.pos.web.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesByDateReportDTO {
    private LocalDate saleDay;
    private Long totalTickets;
    private BigDecimal totalSales;
}
