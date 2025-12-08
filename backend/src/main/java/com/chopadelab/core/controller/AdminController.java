package com.chopadelab.core.controller;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@lombok.RequiredArgsConstructor
public class AdminController {

    private final com.chopadelab.core.repository.UserRepository userRepository;

    @GetMapping("/users")
    public org.springframework.http.ResponseEntity<java.util.List<com.chopadelab.core.entity.User>> getAllUsers() {
        return org.springframework.http.ResponseEntity.ok(userRepository.findAll());
    }
}
