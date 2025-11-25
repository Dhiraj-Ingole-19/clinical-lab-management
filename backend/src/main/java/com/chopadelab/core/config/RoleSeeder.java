package com.chopadelab.core.config;

import com.chopadelab.core.entity.Role;
import com.chopadelab.core.repository.RoleRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@Lazy(false)
@RequiredArgsConstructor
public class RoleSeeder {

    private final RoleRepository roleRepository;

    @PostConstruct
    public void seedRoles() {
        List<String> defaultRoles = List.of("ROLE_USER", "ROLE_ADMIN");

        for (String roleName : defaultRoles) {
            roleRepository.findByName(roleName).orElseGet(() -> {
                Role role = new Role();
                role.setName(roleName);
                return roleRepository.save(role);
            });
        }
    }
}
