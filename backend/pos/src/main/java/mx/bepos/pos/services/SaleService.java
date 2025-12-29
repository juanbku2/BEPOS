package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import mx.bepos.pos.domain.*;
import mx.bepos.pos.domain.repositories.*;
import mx.bepos.pos.web.dto.SaleRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SaleService {

    private final SaleRepository saleRepository;
    private final SaleItemRepository saleItemRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final CreditHistoryRepository creditHistoryRepository;

    @Transactional
    public Sale createSale(SaleRequest saleRequest) {
        Sale sale = new Sale();
        sale.setPaymentMethod(saleRequest.getPaymentMethod());

        if (saleRequest.getCustomerId() != null) {
            Customer customer = customerRepository.findById(saleRequest.getCustomerId())
                    .orElseThrow(() -> new RuntimeException("Customer not found"));
            sale.setCustomer(customer);
        }

        List<SaleItem> saleItems = new ArrayList<>();
        BigDecimal totalAmount = BigDecimal.ZERO;

        for (var itemRequest : saleRequest.getItems()) {
            Product product = productRepository.findById(itemRequest.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"));

            if (product.getStockQuantity().compareTo(itemRequest.getQuantity()) < 0) {
                throw new RuntimeException("Not enough stock for product: " + product.getName());
            }

            product.setStockQuantity(product.getStockQuantity().subtract(itemRequest.getQuantity()));
            productRepository.save(product);

            SaleItem saleItem = new SaleItem();
            saleItem.setProduct(product);
            saleItem.setQuantity(itemRequest.getQuantity());
            saleItem.setUnitPrice(product.getSalePrice());
            saleItem.setTotalPrice(product.getSalePrice().multiply(itemRequest.getQuantity()));
            saleItem.setSale(sale);

            saleItems.add(saleItem);
            totalAmount = totalAmount.add(saleItem.getTotalPrice());
        }

        sale.setTotalAmount(totalAmount);
        Sale savedSale = saleRepository.save(sale);
        saleItemRepository.saveAll(saleItems);

        if ("Credit".equalsIgnoreCase(sale.getPaymentMethod()) && sale.getCustomer() != null) {
            Customer customer = sale.getCustomer();
            customer.setCurrentDebt(customer.getCurrentDebt().add(totalAmount));
            customerRepository.save(customer);

            CreditHistory creditHistory = new CreditHistory();
            creditHistory.setCustomer(customer);
            creditHistory.setSale(savedSale);
            creditHistory.setAmount(totalAmount);
            creditHistory.setTransactionType("DEBT");
            creditHistoryRepository.save(creditHistory);
        }

        return savedSale;
    }
}
