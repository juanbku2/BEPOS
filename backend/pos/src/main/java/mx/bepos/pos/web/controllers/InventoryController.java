package mx.bepos.pos.web.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mx.bepos.pos.services.InventoryService;
import mx.bepos.pos.web.dto.InventoryHistoryResponse;
import mx.bepos.pos.web.dto.StockAdjustmentRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @PostMapping("/adjust")
    public ResponseEntity<Void> adjustStock(@Valid @RequestBody StockAdjustmentRequest request) {
        inventoryService.adjustStock(request);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/history")
    public ResponseEntity<List<InventoryHistoryResponse>> getInventoryHistory(@RequestParam Integer productId) {
        return ResponseEntity.ok(inventoryService.getInventoryHistory(productId));
    }
}
