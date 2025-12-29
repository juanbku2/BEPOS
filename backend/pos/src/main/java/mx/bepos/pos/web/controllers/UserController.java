package mx.bepos.pos.web.controllers;

import lombok.RequiredArgsConstructor;
import mx.bepos.pos.services.UserService;
import mx.bepos.pos.web.dto.AdminChangePasswordRequest;
import mx.bepos.pos.web.dto.ChangeOwnPasswordRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PutMapping("/me/password")
    public ResponseEntity<Void> changeOwnPassword(@RequestBody ChangeOwnPasswordRequest request) {
        userService.changeOwnPassword(request);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{userId}/password")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> adminChangePassword(@PathVariable Integer userId, @RequestBody AdminChangePasswordRequest request) {
        userService.adminChangePassword(userId, request);
        return ResponseEntity.ok().build();
    }
}
