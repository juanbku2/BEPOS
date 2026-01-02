package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.bepos.pos.domain.*;
import mx.bepos.pos.domain.repositories.InventoryMovementRepository;
import mx.bepos.pos.domain.repositories.InventoryRepository;
import mx.bepos.pos.domain.repositories.ProductRepository;
import mx.bepos.pos.domain.repositories.SupplierRepository;
import mx.bepos.pos.web.dto.ProductRequest;
import mx.bepos.pos.web.dto.ProductResponse;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final InventoryRepository inventoryRepository;
    private final InventoryMovementRepository inventoryMovementRepository;
    private final UserService userService; // Assuming UserService can get current user

    @Transactional(readOnly = true)
    public List<ProductResponse> getAllProducts() {
        log.info("Fetching all products");
        List<Product> products = productRepository.findAll();
        return products.stream().map(product -> {
            BigDecimal stock = inventoryMovementRepository.getStockByProductId(product.getId());
            return ProductResponse.from(product, stock);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<ProductResponse> getProductsByName(String name) {
        log.info("Fetching products by name: {}", name);
        List<Product> products = productRepository.findByNameContainingIgnoreCase(name);
        return products.stream().map(product -> {
            BigDecimal stock = inventoryMovementRepository.getStockByProductId(product.getId());
            return ProductResponse.from(product, stock);
        }).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<ProductResponse> getProductById(Integer id) {
        log.info("Fetching product by id: {}", id);
        return productRepository.findById(id).map(product -> {
            BigDecimal stock = inventoryMovementRepository.getStockByProductId(product.getId());
            return ProductResponse.from(product, stock);
        });
    }

    @Transactional(readOnly = true)
    public Optional<ProductResponse> getProductByBarcode(String barcode) {
        log.info("Fetching product by barcode: {}", barcode);
        return productRepository.findByBarcode(barcode).map(product -> {
            BigDecimal stock = inventoryMovementRepository.getStockByProductId(product.getId());
            return ProductResponse.from(product, stock);
        });
    }

    @Transactional(readOnly = true)
    public Optional<mx.bepos.pos.domain.Supplier> getSupplierById(Integer id) {
        log.info("Fetching supplier by id: {}", id);
        return supplierRepository.findById(id);
    }

    @Transactional
    public ProductResponse createProduct(ProductRequest request) {
        log.info("Creating product: {}", request.getName());
        Product product = new Product();
        product.setName(request.getName());
        product.setBarcode(request.getBarcode());
        product.setPurchasePrice(request.getPurchasePrice());
        product.setSalePrice(request.getSalePrice());
        product.setUnitOfMeasure(UnitOfMeasure.valueOf(request.getUnitOfMeasure()));
        if (request.getSupplierId() != null) {
            supplierRepository.findById(request.getSupplierId()).ifPresent(product::setSupplier);
        }
        product = productRepository.save(product); // Save product to get ID

        // Create Inventory record
        Inventory inventory = new Inventory();
        inventory.setProduct(product);
        inventory.setQuantity(BigDecimal.ZERO); // Quantity is always 0 in this table as per new model.
        inventory.setMinStockAlert(request.getMinStock());
        inventoryRepository.save(inventory);

        // Create initial stock movement
        if (request.getInitialStock() != null && request.getInitialStock().compareTo(BigDecimal.ZERO) > 0) {
            User currentUser = userService.getCurrentUser().orElseThrow(() -> new RuntimeException("Authenticated user not found"));
            InventoryMovement initialMovement = new InventoryMovement();
            initialMovement.setProduct(product);
            initialMovement.setMovementType(MovementType.INITIAL_STOCK);
            initialMovement.setQuantity(request.getInitialStock());
            initialMovement.setCreatedAt(LocalDateTime.now());
            initialMovement.setCreatedBy(currentUser);
            inventoryMovementRepository.save(initialMovement);
        }
        
        BigDecimal currentStock = inventoryMovementRepository.getStockByProductId(product.getId());
        return ProductResponse.from(product, currentStock);
    }

    @Transactional
    public ProductResponse updateProduct(Integer id, ProductRequest request) {
        Product product = productRepository.findById(id).orElseThrow(() -> new RuntimeException("Product not found"));
        log.info("Updating product {}: {}", id, request.getName());
        
        product.setName(request.getName());
        product.setBarcode(request.getBarcode());
        product.setPurchasePrice(request.getPurchasePrice());
        product.setSalePrice(request.getSalePrice());
        product.setUnitOfMeasure(UnitOfMeasure.valueOf(request.getUnitOfMeasure()));
        if (request.getSupplierId() != null) {
            supplierRepository.findById(request.getSupplierId()).ifPresent(product::setSupplier);
        } else {
            product.setSupplier(null);
        }
        product = productRepository.save(product);

        // Update minStockAlert in Inventory
        inventoryRepository.findByProductId(product.getId()).ifPresent(inventory -> {
            inventory.setMinStockAlert(request.getMinStock());
            inventoryRepository.save(inventory);
        });
        
        BigDecimal currentStock = inventoryMovementRepository.getStockByProductId(product.getId());
        return ProductResponse.from(product, currentStock);
    }

    @Transactional
    public void deleteProduct(Integer id) {
        log.info("Deleting product by id: {}", id);
        // Before deleting product, delete associated inventory and inventory movements
        inventoryRepository.findByProductId(id).ifPresent(inventoryRepository::delete);
        inventoryMovementRepository.findByProductId(id).forEach(inventoryMovementRepository::delete);
        productRepository.deleteById(id);
    }
}
