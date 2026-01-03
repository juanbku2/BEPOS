package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.Product;
import mx.bepos.pos.web.dto.reports.SalesByProductReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SalesByProductReportRepository extends Repository<Product, Integer> {

    String SALES_BY_PRODUCT_QUERY = """
            SELECT
                p.id as id,
                p.name as name,
                SUM(si.quantity) AS totalQuantity,
                SUM(si.total_price) AS totalRevenue
            FROM sale_items si
            JOIN products p ON p.id = si.product_id
            JOIN sales s ON s.id = si.sale_id
            WHERE s.sale_date BETWEEN :startDate AND :endDate
            GROUP BY p.id, p.name
            ORDER BY totalRevenue DESC
            """;

    @Query(value = SALES_BY_PRODUCT_QUERY, nativeQuery = true)
    List<SalesByProductReportDTO> getSalesByProductReport(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
