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

    @Override
    public void run(String... args) throws Exception {
        if (!userRepository.existsByUsername("admin")) {
            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Error: Role is not found."));

            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("Admin@123"));
            admin.setEnabled(true);
            admin.setRoles(Set.of(adminRole));

            userRepository.save(admin);
            System.out.println("Admin user seeded successfully.");
        }
    }
}
