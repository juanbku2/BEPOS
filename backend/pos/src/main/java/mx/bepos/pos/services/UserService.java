package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.bepos.pos.domain.User;
import mx.bepos.pos.domain.repositories.UserRepository;
import mx.bepos.pos.web.dto.AdminChangePasswordRequest;
import mx.bepos.pos.web.dto.ChangeOwnPasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public List<User> getAllUsers() {
        log.info("Fetching all users");
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Optional<User> getUserById(Integer id) {
        log.info("Fetching user by id: {}", id);
        return userRepository.findById(id);
    }

    @Transactional
    public User saveUser(User user) {
        log.info("Saving user: {}", user.getUsername());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    @Transactional
    public User updateUser(User user) {
        log.info("Updating user: {}", user.getUsername());
        return userRepository.save(user);
    }

    @Transactional
    public void deleteUser(Integer id) {
        log.info("Deleting user by id: {}", id);
        userRepository.deleteById(id);
    }

    @Transactional
    public void changeOwnPassword(ChangeOwnPasswordRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        log.info("Changing password for user: {}", currentUser.getUsername());
        
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            log.error("Wrong current password for user: {}", currentUser.getUsername());
            throw new BadCredentialsException("Wrong current password");
        }
        
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
        log.info("Password changed successfully for user: {}", currentUser.getUsername());
    }

    @Transactional
    public void adminChangePassword(Integer userId, AdminChangePasswordRequest request) {
        log.info("Admin changing password for user id: {}", userId);
        User user = userRepository.findById(userId)
                .orElseThrow(() -> {
                    log.error("User not found with id: {}", userId);
                    return new RuntimeException("User not found");
                });
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Admin changed password successfully for user: {}", user.getUsername());
    }
    @Transactional(readOnly = true)
    public Optional<User> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return Optional.empty();
        }
        String username = authentication.getName();
        return userRepository.findByUsername(username);
    }
}
