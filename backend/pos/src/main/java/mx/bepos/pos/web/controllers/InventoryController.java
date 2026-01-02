package mx.bepos.pos.web.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mx.bepos.pos.services.InventoryService;
import mx.bepos.pos.web.dto.InventoryMovementResponse;
import mx.bepos.pos.web.dto.InventoryResponse;
import mx.bepos.pos.web.dto.StockAdjustmentRequest;
import mx.bepos.pos.web.dto.StockOperationRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/inventory")
@RequiredArgsConstructor
public class InventoryController {

    private final InventoryService inventoryService;

    @GetMapping("/{productId}")
    public ResponseEntity<InventoryResponse> getStock(@PathVariable Integer productId) {
        return ResponseEntity.ok(InventoryResponse.from(inventoryService.getStock(productId)));
    }

    @GetMapping("/movements/{productId}")
    public ResponseEntity<List<InventoryMovementResponse>> getMovements(@PathVariable Integer productId) {
        return ResponseEntity.ok(inventoryService.getMovements(productId).stream()
                .map(InventoryMovementResponse::from)
                .collect(Collectors.toList()));
    }

    @PostMapping("/increase")
    public ResponseEntity<InventoryResponse> increaseStock(@Valid @RequestBody StockOperationRequest request) {
        return ResponseEntity.ok(InventoryResponse.from(inventoryService.increaseStock(
                request.getProductId(),
                request.getQuantity(),
                request.getReason(),
                request.getReferenceId()
        )));
    }

    @PostMapping("/decrease")
    public ResponseEntity<InventoryResponse> decreaseStock(@Valid @RequestBody StockOperationRequest request) {
        return ResponseEntity.ok(InventoryResponse.from(inventoryService.decreaseStock(
                request.getProductId(),
                request.getQuantity(),
                request.getReason(),
                request.getReferenceId()
        )));
    }

    @PostMapping("/adjust")
    public ResponseEntity<InventoryResponse> adjustStock(@Valid @RequestBody StockAdjustmentRequest request) {
        return ResponseEntity.ok(InventoryResponse.from(inventoryService.adjustStock(
                request.getProductId(),
                request.getQuantity(),
                request.getReason()
        )));
    }
}
