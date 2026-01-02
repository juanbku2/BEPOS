package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.bepos.pos.domain.CashMovement;
import mx.bepos.pos.domain.CashMovementType;
import mx.bepos.pos.domain.CashRegisterClosure;
import mx.bepos.pos.domain.User;
import mx.bepos.pos.domain.repositories.CashMovementRepository;
import mx.bepos.pos.domain.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CashMovementServiceImpl implements CashMovementService {

    private final CashMovementRepository cashMovementRepository;
    private final CashRegisterService cashRegisterService;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public CashMovement cashIn(BigDecimal amount, String reason) {
        return createCashMovement(amount, reason, CashMovementType.IN);
    }

    @Override
    @Transactional
    public CashMovement cashOut(BigDecimal amount, String reason) {
        return createCashMovement(amount, reason, CashMovementType.OUT);
    }

    private CashMovement createCashMovement(BigDecimal amount, String reason, CashMovementType type) {
        CashRegisterClosure openRegister = cashRegisterService.getOpenRegister();
        User user = getCurrentUser().orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        CashMovement cashMovement = new CashMovement();
        cashMovement.setCashRegister(openRegister);
        cashMovement.setAmount(amount);
        cashMovement.setReason(reason);
        cashMovement.setMovementType(type);
        cashMovement.setCreatedBy(user);

        log.info("Creating cash movement: {} of {} for reason: {}", type, amount, reason);
        return cashMovementRepository.save(cashMovement);
    }

    private Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return Optional.empty();
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username);
    }
}
