package com.rideshare.ridesharing.dto;

import jakarta.validation.constraints.*;
import lombok.Data;

@Data
public class BookingRequest {

    @NotNull private Long rideId;
    @NotNull @Min(1) private Integer seatsBooked;

    // Passenger's actual pickup and dropoff
    @NotBlank private String pickupPoint;
    @NotBlank private String dropoffPoint;
}