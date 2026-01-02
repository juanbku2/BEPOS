package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.bepos.pos.domain.*;
import mx.bepos.pos.domain.repositories.*;
import mx.bepos.pos.web.dto.SaleRequest;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final CreditHistoryRepository creditHistoryRepository;

    @Transactional(readOnly = true)
    public List<Sale> getLastSales(int limit) {
        log.info("Fetching last {} sales", limit);
        Pageable pageable = PageRequest.of(0, limit, Sort.by("saleDate").descending());
        return saleRepository.findAll(pageable).getContent();
    }

    @Transactional
    public Sale createSale(SaleRequest saleRequest) {
        log.info("Creating sale: {}", saleRequest);
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        Sale sale = new Sale();
        sale.setPaymentMethod(saleRequest.getPaymentMethod());
        sale.setUser(user);

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

        for (var itemRequest : saleRequest.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> {
                        log.error("Product not found with id: {}", itemRequest.getProductId());
                        return new RuntimeException("Product not found");
                    });

            if (product.getStockQuantity().compareTo(itemRequest.getQuantity()) < 0) {
                log.error("Not enough stock for product: {}. Requested: {}, Available: {}", product.getName(), itemRequest.getQuantity(), product.getStockQuantity());
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity().subtract(itemRequest.getQuantity()));
            productRepository.save(product);

            SaleItem saleItem = new SaleItem();
            saleItem.setProduct(product);
            saleItem.setQuantity(itemRequest.getQuantity());
            saleItem.setUnitPrice(itemRequest.getPrice());
            saleItem.setTotalPrice(itemRequest.getPrice().multiply(itemRequest.getQuantity()));
            saleItem.setSale(sale);

            saleItems.add(saleItem);
            totalAmount = totalAmount.add(saleItem.getTotalPrice());
        }

        sale.setTotalAmount(totalAmount);
        Sale savedSale = saleRepository.save(sale);
        saleItemRepository.saveAll(saleItems);
        log.info("Sale created successfully with id: {}", savedSale.getId());

        if ("Credit".equalsIgnoreCase(sale.getPaymentMethod()) && sale.getCustomer() != null) {
            Customer customer = sale.getCustomer();
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
