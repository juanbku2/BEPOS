package mx.bepos.pos.services;

import lombok.RequiredArgsConstructor;
import mx.bepos.pos.domain.User;
import mx.bepos.pos.domain.repositories.UserRepository;
import mx.bepos.pos.web.dto.AdminChangePasswordRequest;
import mx.bepos.pos.web.dto.ChangeOwnPasswordRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.authentication.BadCredentialsException;


@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void changeOwnPassword(ChangeOwnPasswordRequest request) {
        User currentUser = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        
        if (!passwordEncoder.matches(request.getCurrentPassword(), currentUser.getPassword())) {
            throw new BadCredentialsException("Wrong current password");
        }
        
        currentUser.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(currentUser);
    }

    public void adminChangePassword(Integer userId, AdminChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
