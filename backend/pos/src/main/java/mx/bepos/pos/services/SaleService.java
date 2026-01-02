package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.bepos.pos.domain.*;
import mx.bepos.pos.domain.repositories.*;
import mx.bepos.pos.web.dto.SaleRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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


    @Transactional(readOnly = true)
    public List<Sale> getLastSales(int limit) {
        log.info("Fetching last {} sales", limit);
        Pageable pageable = PageRequest.of(0, limit, Sort.by("saleDate").descending());
        return saleRepository.findAll(pageable).getContent();
    }

    @Transactional
    public Sale createSale(SaleRequest saleRequest) {
        log.info("Creating sale: {}", saleRequest);
        
        User user = getCurrentUser().orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        CashRegisterClosure openRegister = cashRegisterService.getOpenRegister();

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

            // Decrease stock using InventoryService
            inventoryService.decreaseStock(product.getId(), itemRequest.getQuantity(), "SALE", savedSale.getId());

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


    private Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return Optional.empty();
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username);
    }
}
