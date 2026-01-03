package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.bepos.pos.domain.*;
import mx.bepos.pos.domain.repositories.CashMovementRepository;
import mx.bepos.pos.domain.repositories.CashRegisterClosureRepository;
import mx.bepos.pos.domain.repositories.SaleRepository;
import mx.bepos.pos.domain.repositories.UserRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class CashRegisterService   {

    private final CashRegisterClosureRepository cashRegisterClosureRepository;
    private final SaleRepository saleRepository;
    private final CashMovementRepository cashMovementRepository;
    private final UserRepository userRepository;

    @Transactional
    public CashRegisterClosure openRegister(BigDecimal openingAmount) {
        cashRegisterClosureRepository.findByStatus(CashRegisterStatus.OPEN).ifPresent(c -> {
            throw new IllegalStateException("There is already an open cash register.");
        });

        User user = getCurrentUser().orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        CashRegisterClosure cashRegister = new CashRegisterClosure();
        cashRegister.setOpenedAt(LocalDateTime.now());
        cashRegister.setOpenedBy(user);
        cashRegister.setInitialCash(openingAmount);
        cashRegister.setStatus(CashRegisterStatus.OPEN);

        log.info("Opening cash register for user {} with initial cash {}", user.getUsername(), openingAmount);
        return cashRegisterClosureRepository.save(cashRegister);
    }

    @Transactional(readOnly = true)
    public Optional<CashRegisterClosure> getCurrentCashRegister() {
        return cashRegisterClosureRepository.findByStatus(CashRegisterStatus.OPEN);
    }

    @Transactional
    public CashRegisterClosure closeRegister(BigDecimal countedCash) {
        CashRegisterClosure cashRegister = getCurrentCashRegister()
                .orElseThrow(() -> new IllegalStateException("No open cash register found."));
        if (cashRegister.getStatus() == CashRegisterStatus.CLOSED) {
            throw new IllegalStateException("Cash register is already closed.");
        }

        User user = getCurrentUser().orElseThrow(() -> new RuntimeException("Authenticated user not found"));
        log.info("Closing cash register {} by user {}", cashRegister.getId(), user.getUsername());

        List<Sale> sales = saleRepository.findByCashRegisterId(cashRegister.getId());
        BigDecimal totalSales = sales.stream().map(Sale::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCashFromSales = sales.stream().filter(s -> "Cash".equalsIgnoreCase(s.getPaymentMethod())).map(Sale::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCard = sales.stream().filter(s -> "Card".equalsIgnoreCase(s.getPaymentMethod())).map(Sale::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);
        BigDecimal totalCredit = sales.stream().filter(s -> "Credit".equalsIgnoreCase(s.getPaymentMethod())).map(Sale::getTotalAmount).reduce(BigDecimal.ZERO, BigDecimal::add);

        // This part related to CashMovement is not directly requested in the current prompt,
        // but keeping it as it was in the original file.
        // If cash movements are part of the closure calculation, this should be maintained.
        List<CashMovement> cashMovements = cashMovementRepository.findByCashRegisterId(cashRegister.getId());
        BigDecimal totalCashMovements = cashMovements.stream()
                .map(movement -> movement.getMovementType() == CashMovementType.IN ? movement.getAmount() : movement.getAmount().negate())
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal systemCash = cashRegister.getInitialCash().add(totalCashFromSales).add(totalCashMovements);
        BigDecimal cashDifference = countedCash.subtract(systemCash);

        cashRegister.setClosedAt(LocalDateTime.now());
        cashRegister.setClosedBy(user);
        cashRegister.setTotalSales(totalSales);
        cashRegister.setTotalCash(totalCashFromSales);
        cashRegister.setTotalCard(totalCard);
        cashRegister.setTotalCredit(totalCredit);
        cashRegister.setSystemCash(systemCash);
        cashRegister.setCountedCash(countedCash);
        cashRegister.setCashDifference(cashDifference);
        cashRegister.setStatus(CashRegisterStatus.CLOSED);

        return cashRegisterClosureRepository.save(cashRegister);
    }

    @Transactional(readOnly = true)
    public CashRegisterClosure getRegisterById(Integer id) {
        return cashRegisterClosureRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Cash register not found with id: " + id));
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
