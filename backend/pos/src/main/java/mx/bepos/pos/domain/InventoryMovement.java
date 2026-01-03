package mx.bepos.pos.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mx.bepos.pos.web.dto.reports.InventoryMovementReportDTO;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NamedNativeQuery(name = "InventoryMovement.inventoryMovementReport",
        query = """
            SELECT
                im.created_at AS createdAt,
                p.name AS productName,
                im.movement_type AS movementType,
                im.quantity AS quantity,
                im.reason AS reason,
                u.username AS createdBy
            FROM inventory_movement im
            JOIN products p ON p.id = im.product_id
            LEFT JOIN users u ON u.id = im.created_by
            WHERE im.created_at BETWEEN :startDate AND :endDate
            ORDER BY im.created_at DESC
            """,
        resultSetMapping = "Mapping.InventoryMovementReportDTO")
@SqlResultSetMapping(name = "Mapping.InventoryMovementReportDTO",
        classes = @ConstructorResult(targetClass = InventoryMovementReportDTO.class,
                columns = {
                        @ColumnResult(name = "createdAt", type = LocalDateTime.class),
                        @ColumnResult(name = "productName", type = String.class),
                        @ColumnResult(name = "movementType", type = String.class),
                        @ColumnResult(name = "quantity", type = BigDecimal.class),
                        @ColumnResult(name = "reason", type = String.class),
                        @ColumnResult(name = "createdBy", type = String.class)
                }))
@Getter
@Setter
@Entity
@Table(name = "inventory_movement")
public class InventoryMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false, length = 30)
    private MovementType movementType;

    @Column(nullable = false, precision = 10, scale = 3)
    private BigDecimal quantity;

    @Column(name = "reference_id")
    private Integer referenceId; // e.g., sale_id, purchase_id

    @Column
    private String reason;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
}
