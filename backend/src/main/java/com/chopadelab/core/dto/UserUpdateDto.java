package com.chopadelab.core.dto;

import lombok.Data;

@Data
public class UserUpdateDto {
    private String fullName;
    private Integer age;
    private String gender;
    private String address;
    private String phoneNumber;
}
