package com.rideshare.ridesharing.controller;

import com.rideshare.ridesharing.service.FareService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/fare")
@RequiredArgsConstructor
public class FareController {

    private final FareService fareService;

    @GetMapping("/calculate")
    public ResponseEntity<Map<String, Object>> calculateFare(
            @RequestParam String source,
            @RequestParam String destination,
            @RequestParam(defaultValue = "1") int passengers) {

        double distance = fareService.getDistanceInKm(source, destination);

        if (distance <= 0) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", "Could not calculate distance. Check city names!")
            );
        }

        double totalFare = fareService.calculateTotalFare(distance);
        double farePerPassenger = fareService.calculateProportionalFare(
                distance, distance, passengers
        );

        Map<String, Object> response = new HashMap<>();
        response.put("source", source);
        response.put("destination", destination);
        response.put("distanceKm", distance);
        response.put("totalFare", totalFare);
        response.put("passengers", passengers);
        response.put("farePerPassenger", farePerPassenger);
        response.put("breakdown", "Base ₹30 + ₹2 × " + distance + "km");

        return ResponseEntity.ok(response);
    }
}