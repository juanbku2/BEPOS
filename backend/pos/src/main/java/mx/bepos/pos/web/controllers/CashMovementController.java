package mx.bepos.pos.web.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mx.bepos.pos.services.CashMovementService;
import mx.bepos.pos.web.dto.CashMovementRequest;
import mx.bepos.pos.web.dto.CashMovementResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/cash-movement")
@RequiredArgsConstructor
public class CashMovementController {

    private final CashMovementService cashMovementService;

    @PostMapping("/in")
    public ResponseEntity<CashMovementResponse> cashIn(@Valid @RequestBody CashMovementRequest request) {
        return ResponseEntity.ok(CashMovementResponse.from(cashMovementService.cashIn(request.getAmount(), request.getReason())));
    }

    @PostMapping("/out")
    public ResponseEntity<CashMovementResponse> cashOut(@Valid @RequestBody CashMovementRequest request) {
        return ResponseEntity.ok(CashMovementResponse.from(cashMovementService.cashOut(request.getAmount(), request.getReason())));
    }
}
