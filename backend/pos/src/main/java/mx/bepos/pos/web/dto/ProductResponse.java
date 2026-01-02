package mx.bepos.pos.web.dto;

import lombok.Data;
import mx.bepos.pos.domain.Product;

import java.math.BigDecimal; // Restored import

@Data
public class ProductResponse {
    private Integer id;
    private String barcode;
    private String name;
    private BigDecimal purchasePrice;
    private BigDecimal salePrice;
    private BigDecimal stock;
    private BigDecimal minStock;
    private boolean lowStock;
    private String unitOfMeasure; // Changed to String

    public static ProductResponse from(Product product, BigDecimal stock) {
        ProductResponse dto = new ProductResponse();
        dto.setId(product.getId());
        dto.setBarcode(product.getBarcode());
        dto.setName(product.getName());
        dto.setPurchasePrice(product.getPurchasePrice());
        dto.setSalePrice(product.getSalePrice());
        dto.setStock(stock);
        if (product.getInventory() != null) {
            dto.setMinStock(product.getInventory().getMinStockAlert());
            dto.setLowStock(stock.compareTo(product.getInventory().getMinStockAlert()) <= 0);
        } else {
            dto.setMinStock(BigDecimal.ZERO);
            dto.setLowStock(stock.compareTo(BigDecimal.ZERO) <= 0);
        }
        // Safely map unitOfMeasure to String
        dto.setUnitOfMeasure(product.getUnitOfMeasure() != null ? product.getUnitOfMeasure().name() : null);
        return dto;
    }
}
