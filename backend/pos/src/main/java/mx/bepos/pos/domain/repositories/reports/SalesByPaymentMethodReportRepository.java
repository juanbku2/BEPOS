package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.Sale;
import mx.bepos.pos.web.dto.reports.SalesByPaymentMethodReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SalesByPaymentMethodReportRepository extends Repository<Sale, Integer> {

    String SALES_BY_PAYMENT_METHOD_QUERY = """
            SELECT
                s.payment_method AS paymentMethod,
                COUNT(*) AS totalSales,
                SUM(s.total_amount) AS totalAmount
            FROM sales s
            WHERE s.sale_date BETWEEN :startDate AND :endDate
            GROUP BY s.payment_method
            """;

    @Query(value = SALES_BY_PAYMENT_METHOD_QUERY, nativeQuery = true)
    List<SalesByPaymentMethodReportDTO> getSalesByPaymentMethodReport(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
