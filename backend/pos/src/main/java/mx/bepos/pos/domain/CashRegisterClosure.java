package mx.bepos.pos.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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
