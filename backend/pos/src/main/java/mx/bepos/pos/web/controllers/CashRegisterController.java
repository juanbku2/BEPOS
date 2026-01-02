package mx.bepos.pos.web.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mx.bepos.pos.services.CashRegisterService;
import mx.bepos.pos.web.dto.CashRegisterResponse;
import mx.bepos.pos.web.dto.CloseCashRegisterResponse;
import mx.bepos.pos.web.dto.CloseRegisterRequest;
import mx.bepos.pos.web.dto.OpenRegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import mx.bepos.pos.web.dto.CurrentCashRegisterResponse;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/cash-register")
@RequiredArgsConstructor
public class CashRegisterController {

    private final CashRegisterService cashRegisterService;

    @PostMapping("/open")
    public ResponseEntity<CashRegisterResponse> openRegister(@Valid @RequestBody OpenRegisterRequest request) {
        return ResponseEntity.ok(CashRegisterResponse.from(cashRegisterService.openRegister(request.getOpeningAmount())));
    }

    @PostMapping("/close")
    public ResponseEntity<CloseCashRegisterResponse> closeRegister(@Valid @RequestBody CloseRegisterRequest request) {
        return ResponseEntity.ok(CloseCashRegisterResponse.from(cashRegisterService.closeRegister(request.getCountedCash())));
    }

    @GetMapping("/current")
    public ResponseEntity<CurrentCashRegisterResponse> getCurrentRegister() {
        return cashRegisterService.getCurrentCashRegister()
                .map(CurrentCashRegisterResponse::from)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.ok(CurrentCashRegisterResponse.closedStatus()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CashRegisterResponse> getRegisterById(@PathVariable Integer id) {
        return ResponseEntity.ok(CashRegisterResponse.from(cashRegisterService.getRegisterById(id)));
    }
}
