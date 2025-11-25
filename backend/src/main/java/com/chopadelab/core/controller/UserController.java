package com.chopadelab.core.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor // Added for consistency
public class UserController {

    @GetMapping("/hello")
    @PreAuthorize("hasAnyRole('USER','ADMIN')") // Added for explicit security
    public ResponseEntity<String> helloUser(Authentication authentication) {
        // Changed to be personalized
        String username = authentication.getName();
        return ResponseEntity.ok("Hello, " + username + "!");
    }
}
