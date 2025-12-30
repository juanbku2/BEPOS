package mx.bepos.pos.web.controllers;

import lombok.RequiredArgsConstructor;
import mx.bepos.pos.domain.Sale;
import mx.bepos.pos.services.SaleService;
import mx.bepos.pos.web.dto.SaleRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/sales")
@RequiredArgsConstructor
public class SaleController {

    private final SaleService saleService;

    @GetMapping
    public List<Sale> getSales(@RequestParam(defaultValue = "10") int limit) {
        return saleService.getLastSales(limit);
    }

    @PostMapping
    public ResponseEntity<Sale> createSale(@RequestBody SaleRequest saleRequest) {
        try {
            Sale sale = saleService.createSale(saleRequest);
            return ResponseEntity.ok(sale);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(null);
        }
    }
}
