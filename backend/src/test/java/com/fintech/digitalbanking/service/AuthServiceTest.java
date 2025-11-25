package com.fintech.digitalbanking.service;

import com.fintech.digitalbanking.dto.AuthRequest;
import com.fintech.digitalbanking.dto.AuthResponse;
import com.fintech.digitalbanking.entity.Role;
import com.fintech.digitalbanking.entity.User;
import com.fintech.digitalbanking.exception.InvalidCredentialsException;
import com.fintech.digitalbanking.exception.UserAlreadyExistsException;
import com.fintech.digitalbanking.repository.RoleRepository;
import com.fintech.digitalbanking.repository.UserRepository;
import com.fintech.digitalbanking.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    @Mock
    private RoleRepository roleRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private JwtService jwtService;
    @Mock
    private Authentication authentication; // Mock the Authentication object

    @InjectMocks
    private AuthService authService;

    private AuthRequest authRequest;

    @BeforeEach
    void setUp() {
        authRequest = new AuthRequest();
        authRequest.setUsername("testuser");
        authRequest.setPassword("password");
    }

    // --- Login Tests ---
    @Test
    void login_shouldReturnToken_whenCredentialsAreValid() {
        // Arrange
        org.springframework.security.core.userdetails.User userDetails =
                new org.springframework.security.core.userdetails.User("testuser", "password", Set.of());

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("mocked.jwt.token");

        // Act
        AuthResponse response = authService.login(authRequest);

        // Assert
        assertNotNull(response);
        assertEquals("mocked.jwt.token", response.getToken());
    }

    @Test
    void login_shouldThrowException_whenCredentialsAreInvalid() {
        // Arrange
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Bad credentials"));

        // Act & Assert
        assertThrows(InvalidCredentialsException.class, () -> {
            authService.login(authRequest);
        });
    }

    // --- Register Tests ---
    @Test
    void register_shouldSucceed_whenUsernameIsNew() {
        // Arrange
        Role userRole = new Role(1L, "ROLE_USER");
        User newUser = User.builder().username("testuser").password("encodedPassword").roles(Set.of(userRole)).build();
        org.springframework.security.core.userdetails.User userDetails =
                new org.springframework.security.core.userdetails.User("testuser", "encodedPassword", Set.of());

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.empty());
        when(roleRepository.findByName("ROLE_USER")).thenReturn(Optional.of(userRole));
        when(passwordEncoder.encode("password")).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(newUser);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class))).thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(jwtService.generateToken(userDetails)).thenReturn("new.user.token");

        // Act
        AuthResponse response = authService.register(authRequest);

        // Assert
        assertNotNull(response);
        assertEquals("new.user.token", response.getToken());
    }

    @Test
    void register_shouldThrowException_whenUsernameExists() {
        // Arrange
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(new User()));

        // Act & Assert
        assertThrows(UserAlreadyExistsException.class, () -> {
            authService.register(authRequest);
        });
    }
}