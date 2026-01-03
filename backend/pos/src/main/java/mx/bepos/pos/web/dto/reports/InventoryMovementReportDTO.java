package mx.bepos.pos.web.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InventoryMovementReportDTO {
    private LocalDateTime createdAt;
    private String productName;
    private String movementType;
    private BigDecimal quantity;
    private String reason;
    private String createdBy;
}
