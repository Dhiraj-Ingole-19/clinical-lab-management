package com.chopadelab.core.config;

import com.chopadelab.core.entity.Role;
import com.chopadelab.core.entity.User;
import com.chopadelab.core.repository.RoleRepository;
import com.chopadelab.core.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @org.springframework.beans.factory.annotation.Value("${app.admin.password}")
    private String adminPassword;

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

            User admin = new User();
            admin.setUsername("admin");

            if (adminPassword == null || adminPassword.isBlank()) {
                throw new RuntimeException(
                        "Admin password not set in environment variables! Please set app.admin.password.");
            }

            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setEnabled(true);
            admin.setRoles(Set.of(adminRole));

            userRepository.save(admin);
            System.out.println("Admin user seeded successfully.");
        }
    }
}
