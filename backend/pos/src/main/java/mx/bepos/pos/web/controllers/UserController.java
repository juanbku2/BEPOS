package mx.bepos.pos.web.controllers;

import lombok.RequiredArgsConstructor;
import mx.bepos.pos.domain.User;
import mx.bepos.pos.services.UserService;
import mx.bepos.pos.web.dto.AdminChangePasswordRequest;
import mx.bepos.pos.web.dto.ChangeOwnPasswordRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<User> getUserById(@PathVariable Integer id) {
        return userService.getUserById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public User createUser(@RequestBody User user) {
        return userService.saveUser(user);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<User> updateUser(@PathVariable Integer id, @RequestBody User userDetails) {
        return userService.getUserById(id)
                .map(user -> {
                    user.setUsername(userDetails.getUsername());
                    user.setFirstName(userDetails.getFirstName());
                    user.setLastName(userDetails.getLastName());
                    user.setEmail(userDetails.getEmail());
                    user.setRole(userDetails.getRole());
                    return ResponseEntity.ok(userService.updateUser(user));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

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

    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUserProfile() {
        return userService.getCurrentUser()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
