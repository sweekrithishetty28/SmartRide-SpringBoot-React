package com.rideshare.ridesharing.dto;

import com.rideshare.ridesharing.entity.User;
import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank private String name;
    @Email @NotBlank private String email;
    @NotBlank @Size(min = 6) private String password;
    @NotBlank private String phone;
    @NotNull private User.Role role;

    // Driver only
    private String carModel;
    private String licensePlate;
    private Integer seatCapacity;
}