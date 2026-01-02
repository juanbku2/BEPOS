package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.bepos.pos.domain.*;
import mx.bepos.pos.domain.repositories.*;
import mx.bepos.pos.web.dto.SaleRequest;
import mx.bepos.pos.web.dto.StockAdjustmentRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final CreditHistoryRepository creditHistoryRepository;
    private final InventoryService inventoryService;
    private final CashRegisterService cashRegisterService;
    private final UserRepository userRepository;
    private final UserService userService; // Inject UserService

    @Transactional(readOnly = true)
    public List<Sale> getLastSales(int limit) {
        log.info("Fetching last {} sales", limit);
        Pageable pageable = PageRequest.of(0, limit, Sort.by("saleDate").descending());
        return saleRepository.findAll(pageable).getContent();
    }

    @Transactional
    public Sale createSale(SaleRequest saleRequest) {
        log.info("Creating sale: {}", saleRequest);

        // 1. Validate there is an OPEN cash register
        CashRegisterClosure openRegister = cashRegisterService.getCurrentCashRegister()
                .orElseThrow(() -> new IllegalStateException("Cash register is closed"));
        
        User user = userService.getCurrentUser().orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        Sale sale = new Sale();
        sale.setPaymentMethod(saleRequest.getPaymentMethod());
        sale.setUser(user);
        sale.setCashRegister(openRegister);

        if (saleRequest.getCustomerId() != null) {
            Customer customer = customerRepository.findById(saleRequest.getCustomerId())
                    .orElseThrow(() -> {
                        log.error("Customer not found with id: {}", saleRequest.getCustomerId());
                        return new RuntimeException("Customer not found");
                    });
            sale.setCustomer(customer);
        }

        List<SaleItem> saleItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        // First, save the sale to get an ID
        Sale savedSale = saleRepository.save(sale);

        for (var itemRequest : saleRequest.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> {
                        log.error("Product not found with id: {}", itemRequest.getProductId());
                        return new RuntimeException("Product not found");
                    });

            // Decrease stock using InventoryService.adjustStock
            StockAdjustmentRequest stockAdjustmentRequest = new StockAdjustmentRequest();
            stockAdjustmentRequest.setProductId(product.getId());
            stockAdjustmentRequest.setQuantity(itemRequest.getQuantity().negate()); // Negative for sales
            stockAdjustmentRequest.setMovementType(MovementType.SALE);
            stockAdjustmentRequest.setReason("Sale " + savedSale.getId()); // Optional reason
            inventoryService.adjustStock(stockAdjustmentRequest);

            SaleItem saleItem = new SaleItem();
            saleItem.setProduct(product);
            saleItem.setQuantity(itemRequest.getQuantity());
            saleItem.setUnitPrice(itemRequest.getPrice());
            saleItem.setTotalPrice(itemRequest.getPrice().multiply(itemRequest.getQuantity()));
            saleItem.setSale(savedSale);

            saleItems.add(saleItem);
            totalAmount = totalAmount.add(saleItem.getTotalPrice());
        }

        savedSale.setTotalAmount(totalAmount);
        saleItemRepository.saveAll(saleItems);
        log.info("Sale created successfully with id: {}", savedSale.getId());

        if ("Credit".equalsIgnoreCase(savedSale.getPaymentMethod()) && savedSale.getCustomer() != null) {
            Customer customer = savedSale.getCustomer();
            customer.setCurrentDebt(customer.getCurrentDebt().add(totalAmount));
            customerRepository.save(customer);
            log.info("Customer debt updated for customer: {}", customer.getId());

            CreditHistory creditHistory = new CreditHistory();
            creditHistory.setCustomer(customer);
            creditHistory.setSale(savedSale);
            creditHistory.setAmount(totalAmount);
            creditHistory.setTransactionType("DEBT");
            creditHistoryRepository.save(creditHistory);
            log.info("Credit history created for customer: {}", customer.getId());
        }

        return savedSale;
    }
}
