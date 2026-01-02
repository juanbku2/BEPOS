package mx.bepos.pos.web.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class StockAdjustmentRequest {
    @NotNull
    private Integer productId;
    @NotNull
    private BigDecimal quantity;
    private String reason;
}
