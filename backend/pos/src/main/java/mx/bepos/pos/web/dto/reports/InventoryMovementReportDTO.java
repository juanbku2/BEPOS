package mx.bepos.pos.web.dto.reports;

import lombok.Data;
import mx.bepos.pos.domain.MovementType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class InventoryMovementReportDTO {
    private LocalDateTime createdAt;
    private String productName;
    private MovementType movementType;
    private BigDecimal quantity;
    private String reason;
    private String createdBy;
}
