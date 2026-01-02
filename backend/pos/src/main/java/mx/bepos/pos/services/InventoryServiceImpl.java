package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.bepos.pos.domain.*;
import mx.bepos.pos.domain.repositories.InventoryMovementRepository;
import mx.bepos.pos.domain.repositories.InventoryRepository;
import mx.bepos.pos.domain.repositories.ProductRepository;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryServiceImpl implements InventoryService {

    private final InventoryRepository inventoryRepository;
    private final InventoryMovementRepository inventoryMovementRepository;
    private final ProductRepository productRepository;
    // TODO: Make negative stock configurable
    private final boolean allowNegativeStock = true;

    @Override
    @Transactional(readOnly = true)
    public Inventory getStock(Integer productId) {
        return inventoryRepository.findByProductId(productId)
                .orElseThrow(() -> new RuntimeException("Inventory not found for product id: " + productId));
    }

    @Override
    @Transactional
    public Inventory increaseStock(Integer productId, BigDecimal quantity, String reason, Integer referenceId) {
        return updateStock(productId, quantity, MovementType.PURCHASE, reason, referenceId);
    }

    @Override
    @Transactional
    public Inventory decreaseStock(Integer productId, BigDecimal quantity, String reason, Integer referenceId) {
        return updateStock(productId, quantity.negate(), MovementType.SALE, reason, referenceId);
    }

    @Override
    @Transactional
    public Inventory adjustStock(Integer productId, BigDecimal quantity, String reason) {
        return updateStock(productId, quantity, MovementType.ADJUSTMENT, reason, null);
    }

    @Override
    @Transactional(readOnly = true)
    public List<InventoryMovement> getMovements(Integer productId) {
        return inventoryMovementRepository.findByProductId(productId);
    }

    private Inventory updateStock(Integer productId, BigDecimal quantity, MovementType type, String reason, Integer referenceId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        Inventory inventory = inventoryRepository.findByProductId(productId)
                .orElseGet(() -> {
                    log.info("No inventory record found for product id: {}. Creating a new one.", productId);
                    Inventory newInventory = new Inventory();
                    newInventory.setProduct(product);
                    newInventory.setQuantity(BigDecimal.ZERO);
                    return newInventory;
                });

        BigDecimal newQuantity = inventory.getQuantity().add(quantity);

        if (newQuantity.compareTo(BigDecimal.ZERO) < 0 && !allowNegativeStock) {
            throw new RuntimeException("Not enough stock for product: " + product.getName() + ". Requested: " + quantity.abs() + ", Available: " + inventory.getQuantity());
        } else if (newQuantity.compareTo(BigDecimal.ZERO) < 0) {
            log.warn("Stock for product {} is negative: {}", product.getName(), newQuantity);
        }

        inventory.setQuantity(newQuantity);
        inventory.setUpdatedAt(LocalDateTime.now());
        Inventory savedInventory = inventoryRepository.save(inventory);

        InventoryMovement movement = new InventoryMovement();
        movement.setProduct(product);
        movement.setMovementType(type);
        movement.setQuantity(quantity);
        movement.setReason(reason);
        movement.setReferenceId(referenceId);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.getPrincipal() instanceof User) {
            movement.setCreatedBy((User) authentication.getPrincipal());
        } else if (authentication != null) {
            log.warn("Authenticated principal is not an instance of mx.bepos.pos.domain.User: {}", authentication.getPrincipal().getClass().getName());
        }


        inventoryMovementRepository.save(movement);

        return savedInventory;
    }
}
