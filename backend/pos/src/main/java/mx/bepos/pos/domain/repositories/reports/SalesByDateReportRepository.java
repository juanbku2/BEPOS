package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.Sale;
import mx.bepos.pos.web.dto.reports.SalesByDateReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface SalesByDateReportRepository extends Repository<Sale, Integer> {

    @Query(name = "Sale.salesByDateReport", nativeQuery = true)
    List<SalesByDateReportDTO> getSalesByDateReport(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
