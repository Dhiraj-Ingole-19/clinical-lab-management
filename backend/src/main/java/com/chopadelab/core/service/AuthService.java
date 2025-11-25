package com.chopadelab.core.service;

import com.chopadelab.core.dto.AuthRequest;
import com.chopadelab.core.dto.AuthResponse;
import com.chopadelab.core.entity.Role;
import com.chopadelab.core.entity.User;
import com.chopadelab.core.exception.InvalidCredentialsException;
import com.chopadelab.core.exception.UserAlreadyExistsException;
import com.chopadelab.core.repository.RoleRepository; // ADDED
import com.chopadelab.core.repository.UserRepository;
import com.chopadelab.core.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Set;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository; // ADDED
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    /**
     * Login an existing user.
     */
    public AuthResponse login(AuthRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);

            return new AuthResponse(token);
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Invalid username or password", e);
        }
    }

    /**
     * Register a new user (defaults to ROLE_USER).
     */
    public AuthResponse register(AuthRequest request) {
        if (userRepository.findByUsername(request.getUsername()).isPresent()) {
            throw new UserAlreadyExistsException("Username already exists: " + request.getUsername());
        }

        // CHANGED: Fetch the existing ROLE_USER from the database
        Role userRole = roleRepository.findByName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Error: Default role ROLE_USER not found."));

        User user = User.builder()
                .username(request.getUsername())
                .password(passwordEncoder.encode(request.getPassword()))
                .enabled(true)
                .roles(Set.of(userRole)) // CHANGED: Use the fetched role
                .build();

        userRepository.save(user);

        // Authenticate after registration
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        String token = jwtService.generateToken(userDetails);

        return new AuthResponse(token);
    }
}
