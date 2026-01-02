package mx.bepos.pos.domain.repositories;

import mx.bepos.pos.domain.InventoryMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface InventoryMovementRepository extends JpaRepository<InventoryMovement, Integer> {
    List<InventoryMovement> findByProductId(Integer productId);

    @Query("""
        SELECT COALESCE(SUM(im.quantity), 0)
        FROM InventoryMovement im
        WHERE im.product.id = :productId
        """)
    BigDecimal getStockByProductId(Integer productId);
}
