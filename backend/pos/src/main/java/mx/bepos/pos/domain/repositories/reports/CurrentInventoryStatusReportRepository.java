package mx.bepos.pos.domain.repositories.reports;

import mx.bepos.pos.domain.Inventory;
import mx.bepos.pos.web.dto.reports.CurrentInventoryStatusReportDTO;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;

import java.util.List;

public interface CurrentInventoryStatusReportRepository extends Repository<Inventory, Integer> {

    String CURRENT_INVENTORY_STATUS_QUERY = """
            SELECT
                p.id as id,
                p.name as name,
                i.quantity as quantity,
                i.min_stock_alert as minStockAlert,
                CASE
                    WHEN i.quantity <= i.min_stock_alert THEN true
                    ELSE false
                END AS lowStock
            FROM inventory i
            JOIN products p ON p.id = i.product_id
            ORDER BY p.name
            """;

    @Query(value = CURRENT_INVENTORY_STATUS_QUERY, nativeQuery = true)
    List<CurrentInventoryStatusReportDTO> getCurrentInventoryStatusReport();
}
