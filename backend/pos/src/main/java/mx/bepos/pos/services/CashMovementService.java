package mx.bepos.pos.services;

import mx.bepos.pos.domain.CashMovement;

import java.math.BigDecimal;

public interface CashMovementService {
    CashMovement cashIn(BigDecimal amount, String reason);
    CashMovement cashOut(BigDecimal amount, String reason);
}
