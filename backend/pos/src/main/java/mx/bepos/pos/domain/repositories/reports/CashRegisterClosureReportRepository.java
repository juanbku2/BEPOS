package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.CashRegisterClosure;
import mx.bepos.pos.web.dto.reports.CashRegisterClosureReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface CashRegisterClosureReportRepository extends Repository<CashRegisterClosure, Integer> {

    String CASH_REGISTER_CLOSURE_QUERY = """
            SELECT
                c.id AS cashRegisterId,
                c.opened_at AS openedAt,
                c.closed_at AS closedAt,
                u1.username AS openedBy,
                u2.username AS closedBy,
                c.initial_cash AS initialCash,
                c.system_cash AS systemCash,
                c.counted_cash AS countedCash,
                c.cash_difference AS cashDifference,
                c.total_sales AS totalSales,
                c.total_cash AS totalCash,
                c.total_card AS totalCard,
                c.total_credit AS totalCredit,
                c.status AS status
            FROM cash_register_closure c
            LEFT JOIN users u1 ON u1.id = c.opened_by
            LEFT JOIN users u2 ON u2.id = c.closed_by
            WHERE c.id = :cashRegisterId
            """;

    @Query(value = CASH_REGISTER_CLOSURE_QUERY, nativeQuery = true)
    Optional<CashRegisterClosureReportDTO> getCashRegisterClosureReport(@Param("cashRegisterId") Long cashRegisterId);
}
