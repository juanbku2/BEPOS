package mx.bepos.pos.web.dto;

import lombok.Data;
import mx.bepos.pos.domain.InventoryMovement;
import mx.bepos.pos.domain.MovementType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class InventoryMovementResponse {
    private Integer productId;
    private String productName;
    private MovementType movementType;
    private BigDecimal quantity;
    private Integer referenceId;
    private String reason;
    private LocalDateTime createdAt;
    private String createdBy;

    public static InventoryMovementResponse from(InventoryMovement movement) {
        InventoryMovementResponse dto = new InventoryMovementResponse();
        dto.setProductId(movement.getProduct().getId());
        dto.setProductName(movement.getProduct().getName());
        dto.setMovementType(movement.getMovementType());
        dto.setQuantity(movement.getQuantity());
        dto.setReferenceId(movement.getReferenceId());
        dto.setReason(movement.getReason());
        dto.setCreatedAt(movement.getCreatedAt());
        if (movement.getCreatedBy() != null) {
            dto.setCreatedBy(movement.getCreatedBy().getUsername());
        }
        return dto;
    }
}
