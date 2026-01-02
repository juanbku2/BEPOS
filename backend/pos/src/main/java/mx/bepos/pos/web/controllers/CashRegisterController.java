package mx.bepos.pos.web.controllers;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import mx.bepos.pos.services.CashRegisterService;
import mx.bepos.pos.web.dto.CashRegisterResponse;
import mx.bepos.pos.web.dto.CloseRegisterRequest;
import mx.bepos.pos.web.dto.OpenRegisterRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/cash-register")
@RequiredArgsConstructor
public class CashRegisterController {

    private final CashRegisterService cashRegisterService;

    @PostMapping("/open")
    public ResponseEntity<CashRegisterResponse> openRegister(@Valid @RequestBody OpenRegisterRequest request) {
        return ResponseEntity.ok(CashRegisterResponse.from(cashRegisterService.openRegister(request.getInitialCash())));
    }

    @PostMapping("/close")
    public ResponseEntity<CashRegisterResponse> closeRegister(@Valid @RequestBody CloseRegisterRequest request) {
        return ResponseEntity.ok(CashRegisterResponse.from(cashRegisterService.closeRegister(request.getCountedCash())));
    }

    @GetMapping("/current")
    public ResponseEntity<CashRegisterResponse> getOpenRegister() {
        return ResponseEntity.ok(CashRegisterResponse.from(cashRegisterService.getOpenRegister()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CashRegisterResponse> getRegisterById(@PathVariable Integer id) {
        return ResponseEntity.ok(CashRegisterResponse.from(cashRegisterService.getRegisterById(id)));
    }
}
