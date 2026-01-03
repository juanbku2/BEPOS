package mx.bepos.pos.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mx.bepos.pos.web.dto.reports.CurrentInventoryStatusReportDTO;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NamedNativeQuery(name = "Inventory.currentInventoryStatusReport",
        query = """
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
            """,
        resultSetMapping = "Mapping.CurrentInventoryStatusReportDTO")
@SqlResultSetMapping(name = "Mapping.CurrentInventoryStatusReportDTO",
        classes = @ConstructorResult(targetClass = CurrentInventoryStatusReportDTO.class,
                columns = {
                        @ColumnResult(name = "id", type = Long.class),
                        @ColumnResult(name = "name", type = String.class),
                        @ColumnResult(name = "quantity", type = BigDecimal.class),
                        @ColumnResult(name = "minStockAlert", type = BigDecimal.class),
                        @ColumnResult(name = "lowStock", type = boolean.class)
                }))
@Getter
@Setter
@Entity
@Table(name = "inventory")
public class Inventory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantity;

    @Column(precision = 10, scale = 3)
    private BigDecimal minStockAlert;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
}
