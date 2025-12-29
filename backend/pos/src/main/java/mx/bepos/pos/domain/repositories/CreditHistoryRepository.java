package mx.bepos.pos.domain.repositories;

import mx.bepos.pos.domain.CreditHistory;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CreditHistoryRepository extends JpaRepository<CreditHistory, Integer> {
}
