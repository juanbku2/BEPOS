package mx.bepos.pos.web.dto;

import lombok.Builder;
import lombok.Data;

import mx.bepos.pos.domain.CashRegisterClosure;

import java.math.BigDecimal;

@Data
@Builder
public class CloseCashRegisterResponse {
    private BigDecimal totalSales;
    private BigDecimal cash;
    private BigDecimal card;

    public static CloseCashRegisterResponse from(CashRegisterClosure closure) {
        return CloseCashRegisterResponse.builder()
                .totalSales(closure.getTotalSales())
                .cash(closure.getTotalCash())
                .card(closure.getTotalCard())
                .build();
    }
}
