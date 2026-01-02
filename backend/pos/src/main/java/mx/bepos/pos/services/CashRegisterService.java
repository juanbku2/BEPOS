package mx.bepos.pos.services;

import mx.bepos.pos.domain.CashRegisterClosure;

import java.math.BigDecimal;

public interface CashRegisterService {
    CashRegisterClosure openRegister(BigDecimal initialCash);
    CashRegisterClosure getOpenRegister();
    CashRegisterClosure closeRegister(BigDecimal countedCash);
    CashRegisterClosure getRegisterById(Integer id);
}
