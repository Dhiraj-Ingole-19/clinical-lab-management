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
        String username = "Shubu@2597";

        if (adminPassword == null || adminPassword.isBlank()) {
            System.out.println("Admin password not set in environment (app.admin.password). Skipping update.");
            return;
        }

        Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                .orElseThrow(() -> new RuntimeException("Error: Role ROLE_ADMIN is not found."));

        User admin = userRepository.findByUsername(username)
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setUsername(username);
                    newUser.setRoles(java.util.Set.of(adminRole));
                    newUser.setEnabled(true);
                    return newUser;
                });

        // Always update the password to match the Environment Variable
        admin.setPassword(passwordEncoder.encode(adminPassword));

        // Ensure role is set (for safety)
        admin.setRoles(java.util.Set.of(adminRole));
        admin.setEnabled(true);

        userRepository.save(admin);
        System.out.println("Admin user managed successfully. Password synced with Environment Variable.");
    }
}
