package mx.bepos.pos.web.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class CloseRegisterRequest {
    @NotNull
    private BigDecimal countedCash;
}
