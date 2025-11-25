package com.chopadelab.core.service;

import com.chopadelab.core.entity.User;
import com.chopadelab.core.exception.RoleNotFoundException;
import com.chopadelab.core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RoleNotFoundException("User not found: " + username));

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                user.isEnabled(), // ✅ ensures disabled users can’t log in
                true, true, true,
                user.getRoles().stream()
                        .map(role -> {
                            String rn = role.getName() == null ? "" : role.getName().trim();
                            return rn.startsWith("ROLE_") ? new SimpleGrantedAuthority(rn)
                                    : new SimpleGrantedAuthority("ROLE_" + rn);
                        })
                        .collect(Collectors.toList())
        );
    }
}
