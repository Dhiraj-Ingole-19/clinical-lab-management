package com.chopadelab.core.controller;

import com.chopadelab.core.dto.UserInfoDto;
import com.chopadelab.core.entity.User;
import com.chopadelab.core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserInfoDto> getCurrentUser(Authentication authentication) {
        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        UserInfoDto userInfo = UserInfoDto.builder()
                .id(user.getId())
                .username(user.getUsername())
                .enabled(user.isEnabled())
                .fullName(user.getFullName())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .age(user.getAge())
                .gender(user.getGender())
                .roles(user.getRoles().stream()
                        .map(role -> role.getName())
                        .collect(Collectors.toList()))
                .build();

        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/hello")
    @PreAuthorize("hasAnyRole('USER','ADMIN')")
    public ResponseEntity<String> helloUser(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok("Hello, " + username + "!");
    }
}
