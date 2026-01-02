package mx.bepos.pos.web.dto;

import lombok.Data;
import mx.bepos.pos.domain.CashRegisterClosure;
import mx.bepos.pos.domain.CashRegisterStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CashRegisterResponse {
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

    public static CashRegisterResponse from(CashRegisterClosure closure) {
        CashRegisterResponse dto = new CashRegisterResponse();
        dto.setId(closure.getId());
        dto.setOpenedAt(closure.getOpenedAt());
        dto.setClosedAt(closure.getClosedAt());
        if (closure.getOpenedBy() != null) {
            dto.setOpenedBy(closure.getOpenedBy().getUsername());
        }
        if (closure.getClosedBy() != null) {
            dto.setClosedBy(closure.getClosedBy().getUsername());
        }
        dto.setInitialCash(closure.getInitialCash());
        dto.setSystemCash(closure.getSystemCash());
        dto.setCountedCash(closure.getCountedCash());
        dto.setCashDifference(closure.getCashDifference());
        dto.setTotalSales(closure.getTotalSales());
        dto.setTotalCash(closure.getTotalCash());
        dto.setTotalCard(closure.getTotalCard());
        dto.setTotalCredit(closure.getTotalCredit());
        dto.setStatus(closure.getStatus());
        return dto;
    }
}
