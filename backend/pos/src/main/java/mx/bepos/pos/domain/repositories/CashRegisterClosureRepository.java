package mx.bepos.pos.domain.repositories;

import mx.bepos.pos.domain.CashRegisterClosure;
import mx.bepos.pos.domain.CashRegisterStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CashRegisterClosureRepository extends JpaRepository<CashRegisterClosure, Integer> {
    Optional<CashRegisterClosure> findByStatus(CashRegisterStatus status);
}
