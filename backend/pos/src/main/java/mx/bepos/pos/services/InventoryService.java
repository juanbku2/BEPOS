package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.bepos.pos.domain.InventoryMovement;
import mx.bepos.pos.domain.MovementType;
import mx.bepos.pos.domain.Product;
import mx.bepos.pos.domain.User;
import mx.bepos.pos.domain.repositories.InventoryMovementRepository;
import mx.bepos.pos.domain.repositories.ProductRepository;
import mx.bepos.pos.web.dto.InventoryHistoryResponse;
import mx.bepos.pos.web.dto.StockAdjustmentRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final InventoryMovementRepository inventoryMovementRepository;
    private final ProductRepository productRepository;
    private final UserService userService; // To get current user

    @Transactional
    public void adjustStock(StockAdjustmentRequest request) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        // Validate reason for specific movement types
        if ((request.getMovementType() == MovementType.LOSS || request.getMovementType() == MovementType.MANUAL_ADJUSTMENT)
                && (request.getReason() == null || request.getReason().trim().isEmpty())) {
            throw new IllegalArgumentException("Reason is required for " + request.getMovementType() + " movements.");
        }

        User currentUser = userService.getCurrentUser().orElseThrow(() -> new RuntimeException("Authenticated user not found"));

        InventoryMovement movement = new InventoryMovement();
        movement.setProduct(product);
        movement.setMovementType(request.getMovementType());
        movement.setQuantity(request.getQuantity());
        movement.setReason(request.getReason());
        movement.setCreatedAt(LocalDateTime.now());
        movement.setCreatedBy(currentUser);

        inventoryMovementRepository.save(movement);
        log.info("Stock adjusted for product {} ({}): {} quantity, reason: {}", product.getName(), request.getProductId(), request.getQuantity(), request.getReason());
    }

    @Transactional(readOnly = true)
    public List<InventoryHistoryResponse> getInventoryHistory(Integer productId) {
        productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        return inventoryMovementRepository.findByProductId(productId).stream()
                .map(InventoryHistoryResponse::from)
                .collect(Collectors.toList());
    }
}
