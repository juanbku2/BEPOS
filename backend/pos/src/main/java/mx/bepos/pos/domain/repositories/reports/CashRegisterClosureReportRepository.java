package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.CashRegisterClosure;
import mx.bepos.pos.web.dto.reports.CashRegisterClosureReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CashRegisterClosureReportRepository extends Repository<CashRegisterClosure, Integer> {

    @Query(name = "CashRegisterClosure.report", nativeQuery = true)
    Optional<CashRegisterClosureReportDTO> getCashRegisterClosureReport(@Param("cashRegisterId") Long cashRegisterId);
}
