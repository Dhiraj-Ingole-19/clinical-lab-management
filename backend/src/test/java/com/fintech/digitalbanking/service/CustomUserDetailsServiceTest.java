package com.fintech.digitalbanking.service;

import com.fintech.digitalbanking.entity.Role;
import com.fintech.digitalbanking.entity.User;
import com.fintech.digitalbanking.exception.RoleNotFoundException;
import com.fintech.digitalbanking.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Optional;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class CustomUserDetailsServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private CustomUserDetailsService userDetailsService;

    @Test
    void loadUserByUsername_shouldReturnUserDetails_whenUserExists() {
        // Arrange
        Role userRole = new Role(1L, "ROLE_USER");
        User user = User.builder()
                .username("testuser")
                .password("password")
                .enabled(true)
                .roles(Set.of(userRole))
                .build();

        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(user));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername("testuser");

        // Assert
        assertNotNull(userDetails);
        assertEquals("testuser", userDetails.getUsername());
        assertEquals("password", userDetails.getPassword());
        assertTrue(userDetails.isEnabled());
        assertTrue(userDetails.getAuthorities().contains(new SimpleGrantedAuthority("ROLE_USER")));
    }

    @Test
    void loadUserByUsername_shouldThrowException_whenUserNotFound() {
        // Arrange
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        // Act & Assert
        // Note: Your code throws RoleNotFoundException, but the interface contract is for UsernameNotFoundException.
        // In a real-world scenario, you might want to align these. For now, we test your actual implementation.
        assertThrows(RoleNotFoundException.class, () -> {
            userDetailsService.loadUserByUsername("nonexistent");
        });
    }
}