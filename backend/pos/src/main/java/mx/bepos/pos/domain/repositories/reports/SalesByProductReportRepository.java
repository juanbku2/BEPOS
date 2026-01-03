package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.Product;
import mx.bepos.pos.web.dto.reports.SalesByProductReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SalesByProductReportRepository extends Repository<Product, Integer> {

    @Query(name = "Sale.salesByProductReport", nativeQuery = true)
    List<SalesByProductReportDTO> getSalesByProductReport(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
