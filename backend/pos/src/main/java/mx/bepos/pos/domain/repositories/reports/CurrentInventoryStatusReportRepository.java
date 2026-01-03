package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.Inventory;
import mx.bepos.pos.web.dto.reports.CurrentInventoryStatusReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface CurrentInventoryStatusReportRepository extends Repository<Inventory, Integer> {

    @Query(name = "Inventory.currentInventoryStatusReport", nativeQuery = true)
    List<CurrentInventoryStatusReportDTO> getCurrentInventoryStatusReport();
}
