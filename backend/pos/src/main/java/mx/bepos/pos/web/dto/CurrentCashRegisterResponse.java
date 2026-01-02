package mx.bepos.pos.web.dto;

import lombok.Builder;
import lombok.Data;
import mx.bepos.pos.domain.CashRegisterClosure;
import mx.bepos.pos.domain.CashRegisterStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Data
@Builder
public class CurrentCashRegisterResponse {
    private Integer id;
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
    private CashRegisterStatus status;

    public static CurrentCashRegisterResponse from(CashRegisterClosure closure) {
        return CurrentCashRegisterResponse.builder()
                .id(closure.getId())
                .openedAt(closure.getOpenedAt())
                .closedAt(closure.getClosedAt())
                .openedBy(closure.getOpenedBy() != null ? closure.getOpenedBy().getUsername() : null)
                .closedBy(closure.getClosedBy() != null ? closure.getClosedBy().getUsername() : null)
                .initialCash(closure.getInitialCash())
                .systemCash(closure.getSystemCash())
                .countedCash(closure.getCountedCash())
                .cashDifference(closure.getCashDifference())
                .totalSales(closure.getTotalSales())
                .totalCash(closure.getTotalCash())
                .totalCard(closure.getTotalCard())
                .totalCredit(closure.getTotalCredit())
                .status(closure.getStatus())
                .build();
    }

    public static CurrentCashRegisterResponse closedStatus() {
        return CurrentCashRegisterResponse.builder()
                .status(CashRegisterStatus.CLOSED)
                .build();
    }
}
