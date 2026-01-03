package mx.bepos.pos.web.dto.reports;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.bepos.pos.domain.CashMovementType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CashMovementReportDTO {
    private LocalDateTime createdAt;
    private CashMovementType movementType;
    private String reason;
    private BigDecimal amount;
    private String username;
}
