package mx.bepos.pos.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mx.bepos.pos.web.dto.reports.CashMovementReportDTO;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@NamedNativeQuery(name = "CashMovement.cashMovementReport",
        query = """
            SELECT
                cm.created_at AS createdAt,
                cm.movement_type AS movementType,
                cm.reason AS reason,
                cm.amount AS amount,
                u.username AS username
            FROM cash_movement cm
            LEFT JOIN users u ON u.id = cm.created_by
            WHERE cm.cash_register_id = :cashRegisterId
            ORDER BY cm.created_at
            """,
        resultSetMapping = "Mapping.CashMovementReportDTO")
@SqlResultSetMapping(name = "Mapping.CashMovementReportDTO",
        classes = @ConstructorResult(targetClass = CashMovementReportDTO.class,
                columns = {
                        @ColumnResult(name = "createdAt", type = LocalDateTime.class),
                        @ColumnResult(name = "movementType", type = String.class),
                        @ColumnResult(name = "reason", type = String.class),
                        @ColumnResult(name = "amount", type = BigDecimal.class),
                        @ColumnResult(name = "username", type = String.class)
                }))
@Getter
@Setter
@Entity
@Table(name = "cash_movement")
public class CashMovement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cash_register_id")
    private CashRegisterClosure cashRegister;

    @Enumerated(EnumType.STRING)
    @Column(name = "movement_type", nullable = false, length = 20)
    private CashMovementType movementType;

    @Column
    private String reason;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;
}
