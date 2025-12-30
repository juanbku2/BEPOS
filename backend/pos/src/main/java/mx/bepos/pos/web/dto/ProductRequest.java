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
    private Integer supplierId;
}
