package mx.bepos.pos.services;

import mx.bepos.pos.web.dto.InventoryHistoryResponse;
import mx.bepos.pos.web.dto.StockAdjustmentRequest;

import java.util.List;

public interface InventoryService {
    void adjustStock(StockAdjustmentRequest request);
    List<InventoryHistoryResponse> getInventoryHistory(Integer productId);
}
