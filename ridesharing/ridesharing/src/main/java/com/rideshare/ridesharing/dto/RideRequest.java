package com.rideshare.ridesharing.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class RideRequest {

    @NotBlank private String source;
    @NotBlank private String destination;
    @NotNull private LocalDate rideDate;
    @NotNull private LocalTime rideTime;
    @NotNull @Min(1) private Integer availableSeats;
    @NotNull @Min(0) private Double pricePerSeat;
}