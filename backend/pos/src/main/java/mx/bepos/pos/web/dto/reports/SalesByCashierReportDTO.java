package mx.bepos.pos.web.dto.reports;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SalesByCashierReportDTO {
    private String username;
    private Long totalSales;
    private BigDecimal totalAmount;
}
