package com.rideshare.ridesharing.controller;

import com.rideshare.ridesharing.dto.RegisterRequest;
import com.rideshare.ridesharing.entity.User;
import com.rideshare.ridesharing.service.RideService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final RideService rideService;

    @GetMapping("/profile")
    public ResponseEntity<User> getProfile(Authentication auth) {
        return ResponseEntity.ok(rideService.getProfile(auth.getName()));
    }

    @PutMapping("/profile")
    public ResponseEntity<String> updateProfile(@RequestBody RegisterRequest request,
                                                Authentication auth) {
        return ResponseEntity.ok(rideService.updateProfile(auth.getName(), request));
    }
}