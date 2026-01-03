package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.Sale;
import mx.bepos.pos.web.dto.reports.SalesByDateReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SalesByDateReportRepository extends Repository<Sale, Integer> {

    String SALES_BY_DATE_QUERY = """
            SELECT
                CAST(s.sale_date AS DATE) AS saleDay,
                COUNT(*) AS totalTickets,
                SUM(s.total_amount) AS totalSales
            FROM sales s
            WHERE s.sale_date BETWEEN :startDate AND :endDate
            GROUP BY CAST(s.sale_date AS DATE)
            ORDER BY saleDay
            """;

    @Query(value = SALES_BY_DATE_QUERY, nativeQuery = true)
    List<SalesByDateReportDTO> getSalesByDateReport(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
