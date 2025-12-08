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

                return ResponseEntity.ok(mapToDto(user));
        }

        @org.springframework.web.bind.annotation.PutMapping("/me")
        @PreAuthorize("isAuthenticated()")
        public ResponseEntity<UserInfoDto> updateUser(
                        @org.springframework.web.bind.annotation.RequestBody com.chopadelab.core.dto.UserUpdateDto request,
                        Authentication authentication) {
                User user = userRepository.findByUsername(authentication.getName())
                                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

                // Update fields
                if (request.getFullName() != null)
                        user.setFullName(request.getFullName());
                if (request.getAge() != null)
                        user.setAge(request.getAge());
                if (request.getGender() != null)
                        user.setGender(request.getGender());
                if (request.getAddress() != null)
                        user.setAddress(request.getAddress());
                if (request.getPhoneNumber() != null)
                        user.setPhoneNumber(request.getPhoneNumber());

                userRepository.save(user);

                return ResponseEntity.ok(mapToDto(user));
        }

        private UserInfoDto mapToDto(User user) {
                return UserInfoDto.builder()
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
        }
}
