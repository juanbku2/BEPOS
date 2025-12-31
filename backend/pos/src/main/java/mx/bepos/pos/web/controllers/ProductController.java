package mx.bepos.pos.web.controllers;

import lombok.RequiredArgsConstructor;
import mx.bepos.pos.domain.Product;
import mx.bepos.pos.services.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import mx.bepos.pos.web.dto.ProductRequest;

import java.util.List;
import mx.bepos.pos.domain.UnitOfMeasure;

@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public List<Product> getAllProducts(@RequestParam(required = false) String name) {
        if (name != null && !name.isEmpty()) {
            return productService.getProductsByName(name);
        }
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Integer id) {
        return productService.getProductById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/barcode/{barcode}")
    public ResponseEntity<Product> getProductByBarcode(@PathVariable String barcode) {
        return productService.getProductByBarcode(barcode)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Product createProduct(@RequestBody ProductRequest productRequest) {
        Product product = new Product();
        product.setName(productRequest.getName());
        product.setBarcode(productRequest.getBarcode());
        product.setPurchasePrice(productRequest.getPurchasePrice());
        product.setSalePrice(productRequest.getSalePrice());
        product.setStockQuantity(productRequest.getStockQuantity());
        product.setMinStockAlert(productRequest.getMinStockAlert());
        product.setUnitOfMeasure(productRequest.getUnitOfMeasure() != null ? UnitOfMeasure.valueOf(productRequest.getUnitOfMeasure()) : UnitOfMeasure.UNIT);
        if (productRequest.getSupplierId() != null) {
            productService.getSupplierById(productRequest.getSupplierId())
                    .ifPresent(product::setSupplier);
        }
        return productService.saveProduct(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Integer id, @RequestBody ProductRequest productRequest) {
        return productService.getProductById(id)
                .map(product -> {
                    product.setName(productRequest.getName());
                    product.setBarcode(productRequest.getBarcode());
                    product.setPurchasePrice(productRequest.getPurchasePrice());
                    product.setSalePrice(productRequest.getSalePrice());
                    product.setStockQuantity(productRequest.getStockQuantity());
                    product.setMinStockAlert(productRequest.getMinStockAlert());
                    product.setUnitOfMeasure(productRequest.getUnitOfMeasure() != null ? UnitOfMeasure.valueOf(productRequest.getUnitOfMeasure()) : UnitOfMeasure.UNIT);

                    if (productRequest.getSupplierId() != null) {
                        productService.getSupplierById(productRequest.getSupplierId())
                                .ifPresent(product::setSupplier);
                    } else {
                        product.setSupplier(null); // Clear supplier if not provided
                    }
                    return ResponseEntity.ok(productService.saveProduct(product));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Integer id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
