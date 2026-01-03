package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.InventoryMovement;
import mx.bepos.pos.web.dto.reports.InventoryMovementReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface InventoryMovementReportRepository extends Repository<InventoryMovement, Integer> {

    @Query(name = "InventoryMovement.inventoryMovementReport", nativeQuery = true)
    List<InventoryMovementReportDTO> getInventoryMovementReport(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
