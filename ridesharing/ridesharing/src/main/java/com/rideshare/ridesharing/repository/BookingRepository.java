package com.rideshare.ridesharing.repository;

import com.rideshare.ridesharing.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    // Get all bookings of a passenger
    List<Booking> findByPassengerId(Long passengerId);

    // Get all bookings for a ride
    List<Booking> findByRideId(Long rideId);
}