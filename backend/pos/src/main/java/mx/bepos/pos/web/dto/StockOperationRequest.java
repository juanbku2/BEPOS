package mx.bepos.pos.web.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class StockOperationRequest {
    @NotNull
    private Integer productId;
    @NotNull
    private BigDecimal quantity;
    private String reason;
    private Integer referenceId;
}
