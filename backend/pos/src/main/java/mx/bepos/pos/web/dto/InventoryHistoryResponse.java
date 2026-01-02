package mx.bepos.pos.web.dto;

import lombok.Builder;
import lombok.Data;
import mx.bepos.pos.domain.InventoryMovement;
import mx.bepos.pos.domain.MovementType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class InventoryHistoryResponse {
    private LocalDateTime date;
    private String user;
    private MovementType movementType;
    private BigDecimal quantity;
    private String reason;

    public static InventoryHistoryResponse from(InventoryMovement movement) {
        return InventoryHistoryResponse.builder()
                .date(movement.getCreatedAt())
                .user(movement.getCreatedBy() != null ? movement.getCreatedBy().getUsername() : "N/A")
                .movementType(movement.getMovementType())
                .quantity(movement.getQuantity())
                .reason(movement.getReason())
                .build();
    }
}
