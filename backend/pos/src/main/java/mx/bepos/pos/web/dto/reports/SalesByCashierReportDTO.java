package mx.bepos.pos.web.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesByCashierReportDTO {
    private String username;
    private Long totalSales;
    private BigDecimal totalAmount;
}
