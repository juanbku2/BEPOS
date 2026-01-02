package mx.bepos.pos.services;

import mx.bepos.pos.domain.CashRegisterClosure;

import java.math.BigDecimal;
import java.util.Optional;

public interface CashRegisterService {
    CashRegisterClosure openRegister(BigDecimal openingAmount);
    Optional<CashRegisterClosure> getCurrentCashRegister();
    CashRegisterClosure closeRegister(BigDecimal countedCash);
    CashRegisterClosure getRegisterById(Integer id);
}
