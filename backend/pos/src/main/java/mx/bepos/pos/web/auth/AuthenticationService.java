package mx.bepos.pos.web.auth;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import mx.bepos.pos.domain.User;
import mx.bepos.pos.domain.repositories.UserRepository;
import mx.bepos.pos.security.services.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthenticationService {
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationResponse register(RegisterRequest request) {
        log.info("Registering user: {}", request.getUsername());
        var user = User.builder()
                .firstName(request.getFirstname())
                .lastName(request.getLastname())
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .build();
        repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        log.info("User registered successfully: {}", request.getUsername());
        return AuthenticationResponse.builder().token(jwtToken).build();
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        log.info("Authenticating user: {}", request.getLoginIdentifier());
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getLoginIdentifier(),
                            request.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            log.error("Authentication failed for user: {}", request.getLoginIdentifier(), e);
            throw e;
        }
        var user = repository.findByUsername(request.getLoginIdentifier())
                .or(()-> repository.findByEmail(request.getLoginIdentifier()))
                .orElseThrow();
        var jwtToken = jwtService.generateToken(user);
        log.info("User authenticated successfully: {}", request.getLoginIdentifier());
        return AuthenticationResponse.builder().token(jwtToken).build();
    }
}
