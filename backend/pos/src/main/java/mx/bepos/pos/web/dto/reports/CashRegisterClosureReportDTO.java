package mx.bepos.pos.web.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CashRegisterClosureReportDTO {
    private Long cashRegisterId;
    private LocalDateTime openedAt;
    private LocalDateTime closedAt;
    private String openedBy;
    private String closedBy;
    private BigDecimal initialCash;
    private BigDecimal systemCash;
    private BigDecimal countedCash;
    private BigDecimal cashDifference;
    private BigDecimal totalSales;
    private BigDecimal totalCash;
    private BigDecimal totalCard;
    private BigDecimal totalCredit;
    private String status;
}
