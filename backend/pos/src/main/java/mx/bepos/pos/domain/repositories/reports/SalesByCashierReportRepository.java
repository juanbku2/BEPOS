package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.Sale;
import mx.bepos.pos.web.dto.reports.SalesByCashierReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SalesByCashierReportRepository extends Repository<Sale, Integer> {

    @Query(name = "Sale.salesByCashierReport", nativeQuery = true)
    List<SalesByCashierReportDTO> getSalesByCashierReport(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
