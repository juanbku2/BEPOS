package mx.bepos.pos.web.dto.reports;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SalesByProductReportDTO {
    private Long id;
    private String name;
    private BigDecimal totalQuantity;
    private BigDecimal totalRevenue;
}
