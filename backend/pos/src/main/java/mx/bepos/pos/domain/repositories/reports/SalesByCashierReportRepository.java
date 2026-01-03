package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.Sale;
import mx.bepos.pos.web.dto.reports.SalesByCashierReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SalesByCashierReportRepository extends Repository<Sale, Integer> {

    String SALES_BY_CASHIER_QUERY = """
            SELECT
                u.username AS username,
                COUNT(s.id) AS totalSales,
                SUM(s.total_amount) AS totalAmount
            FROM sales s
            JOIN users u ON u.id = s.user_id
            WHERE s.sale_date BETWEEN :startDate AND :endDate
            GROUP BY u.username
            ORDER BY totalAmount DESC
            """;

    @Query(value = SALES_BY_CASHIER_QUERY, nativeQuery = true)
    List<SalesByCashierReportDTO> getSalesByCashierReport(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
