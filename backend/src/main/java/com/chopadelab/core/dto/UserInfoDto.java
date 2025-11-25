package com.chopadelab.core.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserInfoDto {
    private Long id;
    private String username;
    private boolean enabled;

    private String fullName;
    private String phoneNumber;
    private String address;

    // --- THIS IS THE FIX ---
    // This line was missing from the file you pasted
    private List<String> roles;
}
