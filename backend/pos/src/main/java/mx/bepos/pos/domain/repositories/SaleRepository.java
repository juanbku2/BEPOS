package mx.bepos.pos.domain.repositories;

import mx.bepos.pos.domain.Sale;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Integer> {
    List<Sale> findByCashRegisterId(Integer cashRegisterId);
}
