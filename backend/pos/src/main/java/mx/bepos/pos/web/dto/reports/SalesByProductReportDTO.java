package mx.bepos.pos.web.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SalesByProductReportDTO {
    private Long id;
    private String name;
    private BigDecimal totalQuantity;
    private BigDecimal totalRevenue;
}
