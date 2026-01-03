package mx.bepos.pos.web.dto.reports;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SalesByPaymentMethodReportDTO {
    private String paymentMethod;
    private Long totalSales;
    private BigDecimal totalAmount;
}
