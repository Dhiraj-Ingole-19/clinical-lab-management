package com.chopadelab.core.security;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class AdminPasswordGenerator {

    public static void main(String[] args) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        String rawPassword = "Admin@123"; // your desired admin password
        String hashedPassword = encoder.encode(rawPassword);
        System.out.println("BCrypt Hashed Password: " + hashedPassword);
    }
}
