package mx.bepos.pos.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import mx.bepos.pos.web.dto.reports.SalesByCashierReportDTO;
import mx.bepos.pos.web.dto.reports.SalesByDateReportDTO;
import mx.bepos.pos.web.dto.reports.SalesByPaymentMethodReportDTO;
import mx.bepos.pos.web.dto.reports.SalesByProductReportDTO;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@NamedNativeQuery(name = "Sale.salesByDateReport",
        query = """
            SELECT
                CAST(s.sale_date AS DATE) AS saleDay,
                COUNT(*) AS totalTickets,
                SUM(s.total_amount) AS totalSales
            FROM sales s
            WHERE s.sale_date BETWEEN :startDate AND :endDate
            GROUP BY CAST(s.sale_date AS DATE)
            ORDER BY saleDay
            """,
        resultSetMapping = "Mapping.SalesByDateReportDTO")
@SqlResultSetMapping(name = "Mapping.SalesByDateReportDTO",
        classes = @ConstructorResult(targetClass = SalesByDateReportDTO.class,
                columns = {
                        @ColumnResult(name = "saleDay", type = LocalDate.class),
                        @ColumnResult(name = "totalTickets", type = Long.class),
                        @ColumnResult(name = "totalSales", type = BigDecimal.class)
                }))
@NamedNativeQuery(name = "Sale.salesByProductReport",
        query = """
            SELECT
                p.id as id,
                p.name as name,
                SUM(si.quantity) AS totalQuantity,
                SUM(si.total_price) AS totalRevenue
            FROM sale_items si
            JOIN products p ON p.id = si.product_id
            JOIN sales s ON s.id = si.sale_id
            WHERE s.sale_date BETWEEN :startDate AND :endDate
            GROUP BY p.id, p.name
            ORDER BY totalRevenue DESC
            """,
        resultSetMapping = "Mapping.SalesByProductReportDTO")
@SqlResultSetMapping(name = "Mapping.SalesByProductReportDTO",
        classes = @ConstructorResult(targetClass = SalesByProductReportDTO.class,
                columns = {
                        @ColumnResult(name = "id", type = Long.class),
                        @ColumnResult(name = "name", type = String.class),
                        @ColumnResult(name = "totalQuantity", type = BigDecimal.class),
                        @ColumnResult(name = "totalRevenue", type = BigDecimal.class)
                }))
@NamedNativeQuery(name = "Sale.salesByPaymentMethodReport",
        query = """
            SELECT
                s.payment_method AS paymentMethod,
                COUNT(*) AS totalSales,
                SUM(s.total_amount) AS totalAmount
            FROM sales s
            WHERE s.sale_date BETWEEN :startDate AND :endDate
            GROUP BY s.payment_method
            """,
        resultSetMapping = "Mapping.SalesByPaymentMethodReportDTO")
@SqlResultSetMapping(name = "Mapping.SalesByPaymentMethodReportDTO",
        classes = @ConstructorResult(targetClass = SalesByPaymentMethodReportDTO.class,
                columns = {
                        @ColumnResult(name = "paymentMethod", type = String.class),
                        @ColumnResult(name = "totalSales", type = Long.class),
                        @ColumnResult(name = "totalAmount", type = BigDecimal.class)
                }))
@NamedNativeQuery(name = "Sale.salesByCashierReport",
        query = """
            SELECT
                u.username AS username,
                COUNT(s.id) AS totalSales,
                SUM(s.total_amount) AS totalAmount
            FROM sales s
            JOIN users u ON u.id = s.user_id
            WHERE s.sale_date BETWEEN :startDate AND :endDate
            GROUP BY u.username
            ORDER BY totalAmount DESC
            """,
        resultSetMapping = "Mapping.SalesByCashierReportDTO")
@SqlResultSetMapping(name = "Mapping.SalesByCashierReportDTO",
        classes = @ConstructorResult(targetClass = SalesByCashierReportDTO.class,
                columns = {
                        @ColumnResult(name = "username", type = String.class),
                        @ColumnResult(name = "totalSales", type = Long.class),
                        @ColumnResult(name = "totalAmount", type = BigDecimal.class)
                }))
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "sales")
public class Sale {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, updatable = false)
    @Builder.Default
    private LocalDateTime saleDate = LocalDateTime.now();

    @Column(precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Column(length = 20)
    private String paymentMethod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customer_id")
    private Customer customer;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cash_register_id")
    private CashRegisterClosure cashRegister;
}
