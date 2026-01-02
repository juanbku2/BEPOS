package mx.bepos.pos.web.dto;

import lombok.Data;
import mx.bepos.pos.domain.Inventory;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class InventoryResponse {
    private Integer productId;
    private String productName;
    private BigDecimal quantity;
    private BigDecimal minStockAlert;
    private LocalDateTime updatedAt;

    public static InventoryResponse from(Inventory inventory) {
        InventoryResponse dto = new InventoryResponse();
        dto.setProductId(inventory.getProduct().getId());
        dto.setProductName(inventory.getProduct().getName());
        dto.setQuantity(inventory.getQuantity());
        dto.setMinStockAlert(inventory.getMinStockAlert());
        dto.setUpdatedAt(inventory.getUpdatedAt());
        return dto;
    }
}
