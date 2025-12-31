package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import mx.bepos.pos.domain.Product;
import mx.bepos.pos.domain.repositories.ProductRepository;
import mx.bepos.pos.domain.repositories.SupplierRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;

    @Transactional(readOnly = true)
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Product> getProductsByName(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    @Transactional(readOnly = true)
    public Optional<Product> getProductById(Integer id) {
        return productRepository.findById(id);
    }

    @Transactional(readOnly = true)
    public Optional<Product> getProductByBarcode(String barcode) {
        return productRepository.findByBarcode(barcode);
    }

    @Transactional(readOnly = true)
    public Optional<mx.bepos.pos.domain.Supplier> getSupplierById(Integer id) {
        return supplierRepository.findById(id);
    }

    @Transactional
    public Product saveProduct(Product product) {
        if (product.getSupplier() != null && product.getSupplier().getId() != null) {
            supplierRepository.findById(product.getSupplier().getId())
                    .ifPresent(product::setSupplier);
        }
        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }
}
