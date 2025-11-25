package com.chopadelab.core.util;

import com.chopadelab.core.entity.User;
import com.chopadelab.core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SecurityUtil {

    private final UserRepository userRepository;

    public Authentication getAuth() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            throw new AccessDeniedException("No authenticated user");
        }
        return auth;
    }

    public String getCurrentUsername() {
        return getAuth().getName();
    }

    public User getCurrentUserEntity() {
        return userRepository.findByUsername(getCurrentUsername())
                .orElseThrow(() -> new AccessDeniedException("Authenticated user not found"));
    }

    public boolean isAdmin() {
        return getAuth().getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN"));
    }
}
