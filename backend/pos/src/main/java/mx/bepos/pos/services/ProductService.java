package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.bepos.pos.domain.Product;
import mx.bepos.pos.domain.repositories.ProductRepository;
import mx.bepos.pos.domain.repositories.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        log.info("Fetching all products");
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsByName(String name) {
        log.info("Fetching products by name: {}", name);
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Transactional(readOnly = true)
    public Optional<Product> getProductById(Integer id) {
        log.info("Fetching product by id: {}", id);
        return productRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Product> getProductByBarcode(String barcode) {
        log.info("Fetching product by barcode: {}", barcode);
        return productRepository.findByBarcode(barcode);
    }

    @Transactional(readOnly = true)
    public Optional<mx.bepos.pos.domain.Supplier> getSupplierById(Integer id) {
        log.info("Fetching supplier by id: {}", id);
        return supplierRepository.findById(id);
    }

    @Transactional
    public Product saveProduct(Product product) {
        log.info("Saving product: {}", product);
        if (product.getSupplier() != null && product.getSupplier().getId() != null) {
            supplierRepository.findById(product.getSupplier().getId())
                    .ifPresent(product::setSupplier);
        }
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Integer id) {
        log.info("Deleting product by id: {}", id);
        productRepository.deleteById(id);
    }
}
