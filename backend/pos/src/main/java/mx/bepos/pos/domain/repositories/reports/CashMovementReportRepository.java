package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.CashMovement;
import mx.bepos.pos.web.dto.reports.CashMovementReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CashMovementReportRepository extends Repository<CashMovement, Integer> {

    @Query(name = "CashMovement.cashMovementReport", nativeQuery = true)
    List<CashMovementReportDTO> getCashMovementReport(@Param("cashRegisterId") Long cashRegisterId);
}
