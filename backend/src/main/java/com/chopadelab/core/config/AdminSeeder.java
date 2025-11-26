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

            // Fallback if property is missing (though Spring should error out if not
            // present without default)
            String passwordToUse = (adminPassword != null && !adminPassword.isBlank())
                    ? adminPassword
                    : "Admin@123"; // Fallback only if absolutely necessary, but better to enforce env var

            // Better approach: Throw error if not set, but for now let's use the injected
            // value
            if (adminPassword == null || adminPassword.isBlank()) {
                throw new RuntimeException("Admin password not set in environment variables!");
            }

            admin.setPassword(passwordEncoder.encode(adminPassword));
            admin.setEnabled(true);
            admin.setRoles(Set.of(adminRole));

            userRepository.save(admin);
            System.out.println("Admin user seeded successfully.");
        }
    }
}
