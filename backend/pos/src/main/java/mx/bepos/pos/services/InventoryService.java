package mx.bepos.pos.services;

import mx.bepos.pos.domain.Inventory;
import mx.bepos.pos.domain.InventoryMovement;

import java.math.BigDecimal;
import java.util.List;

public interface InventoryService {
    Inventory getStock(Integer productId);
    Inventory increaseStock(Integer productId, BigDecimal quantity, String reason, Integer referenceId);
    Inventory decreaseStock(Integer productId, BigDecimal quantity, String reason, Integer referenceId);
    Inventory adjustStock(Integer productId, BigDecimal quantity, String reason);
    List<InventoryMovement> getMovements(Integer productId);
}
