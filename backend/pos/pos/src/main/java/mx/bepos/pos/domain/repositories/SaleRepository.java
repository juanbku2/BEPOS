package mx.bepos.pos.domain.repositories;

import mx.bepos.pos.domain.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleRepository extends JpaRepository<Sale, Integer> {
}
