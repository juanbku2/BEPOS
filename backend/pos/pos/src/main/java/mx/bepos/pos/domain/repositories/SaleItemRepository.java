package mx.bepos.pos.domain.repositories;

import mx.bepos.pos.domain.SaleItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SaleItemRepository extends JpaRepository<SaleItem, Integer> {
}
