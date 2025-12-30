package mx.bepos.pos.domain.repositories;

import mx.bepos.pos.domain.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    Optional<Product> findByBarcode(String barcode);
    List<Product> findByNameContainingIgnoreCase(String name);
}
