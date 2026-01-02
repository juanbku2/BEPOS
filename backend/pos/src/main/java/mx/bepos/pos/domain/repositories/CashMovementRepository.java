package mx.bepos.pos.domain.repositories;

import mx.bepos.pos.domain.CashMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CashMovementRepository extends JpaRepository<CashMovement, Integer> {
    List<CashMovement> findByCashRegisterId(Integer cashRegisterId);
}
