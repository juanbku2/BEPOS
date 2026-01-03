package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.InventoryMovement;
import mx.bepos.pos.web.dto.reports.InventoryMovementReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface InventoryMovementReportRepository extends Repository<InventoryMovement, Integer> {

    String INVENTORY_MOVEMENT_QUERY = """
            SELECT
                im.created_at AS createdAt,
                p.name AS productName,
                im.movement_type AS movementType,
                im.quantity AS quantity,
                im.reason AS reason,
                u.username AS createdBy
            FROM inventory_movement im
            JOIN products p ON p.id = im.product_id
            LEFT JOIN users u ON u.id = im.created_by
            WHERE im.created_at BETWEEN :startDate AND :endDate
            ORDER BY im.created_at DESC
            """;

    @Query(value = INVENTORY_MOVEMENT_QUERY, nativeQuery = true)
    List<InventoryMovementReportDTO> getInventoryMovementReport(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
