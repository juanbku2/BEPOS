package mx.bepos.pos.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import mx.bepos.pos.web.dto.reports.CashRegisterClosureReportDTO;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@NamedNativeQuery(name = "CashRegisterClosure.report",
        query = """
            SELECT
                c.id AS cashRegisterId,
                c.opened_at AS openedAt,
                c.closed_at AS closedAt,
                u1.username AS openedBy,
                u2.username AS closedBy,
                c.initial_cash AS initialCash,
                c.system_cash AS systemCash,
                c.counted_cash AS countedCash,
                c.cash_difference AS cashDifference,
                c.total_sales AS totalSales,
                c.total_cash AS totalCash,
                c.total_card AS totalCard,
                c.total_credit AS totalCredit,
                c.status AS status
            FROM cash_register_closure c
            LEFT JOIN users u1 ON u1.id = c.opened_by
            LEFT JOIN users u2 ON u2.id = c.closed_by
            WHERE c.id = :cashRegisterId
            """,
        resultSetMapping = "Mapping.CashRegisterClosureReportDTO")
@SqlResultSetMapping(name = "Mapping.CashRegisterClosureReportDTO",
        classes = @ConstructorResult(targetClass = CashRegisterClosureReportDTO.class,
                columns = {
                        @ColumnResult(name = "cashRegisterId", type = Long.class),
                        @ColumnResult(name = "openedAt", type = LocalDateTime.class),
                        @ColumnResult(name = "closedAt", type = LocalDateTime.class),
                        @ColumnResult(name = "openedBy", type = String.class),
                        @ColumnResult(name = "closedBy", type = String.class),
                        @ColumnResult(name = "initialCash", type = BigDecimal.class),
                        @ColumnResult(name = "systemCash", type = BigDecimal.class),
                        @ColumnResult(name = "countedCash", type = BigDecimal.class),
                        @ColumnResult(name = "cashDifference", type = BigDecimal.class),
                        @ColumnResult(name = "totalSales", type = BigDecimal.class),
                        @ColumnResult(name = "totalCash", type = BigDecimal.class),
                        @ColumnResult(name = "totalCard", type = BigDecimal.class),
                        @ColumnResult(name = "totalCredit", type = BigDecimal.class),
                        @ColumnResult(name = "status", type = String.class)
                }))
@Getter
@Setter
@Entity
@Table(name = "cash_register_closure")
public class CashRegisterClosure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private LocalDateTime openedAt;

    @Column
    private LocalDateTime closedAt;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "opened_by")
    private User openedBy;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "closed_by")
    private User closedBy;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal initialCash;

    @Column(precision = 10, scale = 2)
    private BigDecimal systemCash;

    @Column(precision = 10, scale = 2)
    private BigDecimal countedCash;

    @Column(precision = 10, scale = 2)
    private BigDecimal cashDifference;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalSales;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalCash;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalCard;

    @Column(precision = 10, scale = 2)
    private BigDecimal totalCredit;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private CashRegisterStatus status;

    @OneToMany(mappedBy = "cashRegister")
    private List<Sale> sales;
}
