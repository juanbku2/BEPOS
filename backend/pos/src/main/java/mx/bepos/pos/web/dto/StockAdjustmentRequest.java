package mx.bepos.pos.web.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

import mx.bepos.pos.domain.MovementType;

@Data
public class StockAdjustmentRequest {
    @NotNull
    private Integer productId;
    @NotNull
    private BigDecimal quantity;
    @NotNull
    private MovementType movementType; // Should be one of RESTOCK, MANUAL_ADJUSTMENT, LOSS
    private String reason;
}
