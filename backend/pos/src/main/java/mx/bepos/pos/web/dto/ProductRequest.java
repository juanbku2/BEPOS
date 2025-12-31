package mx.bepos.pos.web.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class ProductRequest {
    private String name;
    private String barcode;
    private BigDecimal purchasePrice;
    private BigDecimal salePrice;
    private BigDecimal stockQuantity;
    private BigDecimal minStockAlert;
    private String unitOfMeasure; // Represent as String in DTO for simplicity in request
    private Integer supplierId;
}
