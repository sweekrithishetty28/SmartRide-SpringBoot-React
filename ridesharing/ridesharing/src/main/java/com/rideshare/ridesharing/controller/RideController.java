package com.rideshare.ridesharing.controller;

import com.rideshare.ridesharing.dto.*;
import com.rideshare.ridesharing.entity.*;
import com.rideshare.ridesharing.service.RideService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/rides")
@RequiredArgsConstructor
public class RideController {

    private final RideService rideService;

    // Driver posts ride
    @PostMapping("/post")
    public ResponseEntity<String> postRide(@Valid @RequestBody RideRequest request,
                                           Authentication auth) {
        return ResponseEntity.ok(rideService.postRide(request, auth.getName()));
    }

    // Search rides
    @GetMapping("/search")
    public ResponseEntity<List<Ride>> searchRides(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(rideService.searchRides(source, destination, date));
    }

    // Passenger books a ride
    @PostMapping("/book")
    public ResponseEntity<String> bookRide(@Valid @RequestBody BookingRequest request,
                                           Authentication auth) {
        return ResponseEntity.ok(rideService.bookRide(request, auth.getName()));
    }

    // Driver sees their posted rides
    @GetMapping("/my-rides")
    public ResponseEntity<List<Ride>> getMyRides(Authentication auth) {
        return ResponseEntity.ok(rideService.getMyRides(auth.getName()));
    }

    // Passenger sees their bookings
    @GetMapping("/my-bookings")
    public ResponseEntity<List<Booking>> getMyBookings(Authentication auth) {
        return ResponseEntity.ok(rideService.getMyBookings(auth.getName()));
    }
    // Passenger cancels booking
    @PutMapping("/cancel-booking/{bookingId}")
    public ResponseEntity<String> cancelBooking(@PathVariable Long bookingId,
                                                Authentication auth) {
        return ResponseEntity.ok(rideService.cancelBooking(bookingId, auth.getName()));
    }

    // Driver cancels ride
    @PutMapping("/cancel-ride/{rideId}")
    public ResponseEntity<String> cancelRide(@PathVariable Long rideId,
                                             Authentication auth) {
        return ResponseEntity.ok(rideService.cancelRide(rideId, auth.getName()));
    }
    @PutMapping("/complete-ride/{rideId}")
    public ResponseEntity<String> completeRide(@PathVariable Long rideId,
                                               Authentication auth) {
        System.out.println("AUTH: " + auth); // debug line
        System.out.println("USER: " + (auth != null ? auth.getName() : "NULL"));
        return ResponseEntity.ok(rideService.completeRide(rideId, auth.getName()));
    }
}