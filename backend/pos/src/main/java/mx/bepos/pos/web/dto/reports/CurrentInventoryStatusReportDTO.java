package mx.bepos.pos.web.dto.reports;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CurrentInventoryStatusReportDTO {
    private Long id;
    private String name;
    private BigDecimal quantity;
    private BigDecimal minStockAlert;
    private boolean lowStock;
}
