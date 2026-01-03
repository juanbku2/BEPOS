package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.CashMovement;
import mx.bepos.pos.web.dto.reports.CashMovementReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CashMovementReportRepository extends Repository<CashMovement, Integer> {

    String CASH_MOVEMENT_QUERY = """
            SELECT
                cm.created_at AS createdAt,
                cm.movement_type AS movementType,
                cm.reason AS reason,
                cm.amount AS amount,
                u.username AS username
            FROM cash_movement cm
            LEFT JOIN users u ON u.id = cm.created_by
            WHERE cm.cash_register_id = :cashRegisterId
            ORDER BY cm.created_at
            """;

    @Query(value = CASH_MOVEMENT_QUERY, nativeQuery = true)
    List<CashMovementReportDTO> getCashMovementReport(@Param("cashRegisterId") Long cashRegisterId);
}
