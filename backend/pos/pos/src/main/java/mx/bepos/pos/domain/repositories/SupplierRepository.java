package mx.bepos.pos.domain.repositories;

import mx.bepos.pos.domain.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SupplierRepository extends JpaRepository<Supplier, Integer> {
}
