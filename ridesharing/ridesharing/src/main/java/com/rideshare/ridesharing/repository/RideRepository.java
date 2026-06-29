package com.rideshare.ridesharing.repository;

import com.rideshare.ridesharing.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Long> {

    // Search rides by source, destination, date
    List<Ride> findBySourceContainingIgnoreCaseAndDestinationContainingIgnoreCaseAndRideDateAndStatusAndAvailableSeatsGreaterThan(
            String source, String destination, LocalDate rideDate,
            Ride.RideStatus status, Integer seats
    );

    // Get all rides posted by a driver
    List<Ride> findByDriverId(Long driverId);
}