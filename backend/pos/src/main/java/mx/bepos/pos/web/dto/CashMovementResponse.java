package mx.bepos.pos.web.dto;

import lombok.Data;
import mx.bepos.pos.domain.CashMovement;
import mx.bepos.pos.domain.CashMovementType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class CashMovementResponse {
    private Integer id;
    private Integer cashRegisterId;
    private CashMovementType movementType;
    private String reason;
    private BigDecimal amount;
    private LocalDateTime createdAt;
    private String createdBy;

    public static CashMovementResponse from(CashMovement movement) {
        CashMovementResponse dto = new CashMovementResponse();
        dto.setId(movement.getId());
        dto.setCashRegisterId(movement.getCashRegister().getId());
        dto.setMovementType(movement.getMovementType());
        dto.setReason(movement.getReason());
        dto.setAmount(movement.getAmount());
        dto.setCreatedAt(movement.getCreatedAt());
        if (movement.getCreatedBy() != null) {
            dto.setCreatedBy(movement.getCreatedBy().getUsername());
        }
        return dto;
    }
}
