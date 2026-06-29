package com.rideshare.ridesharing.repository;

import com.rideshare.ridesharing.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByDriverId(Long driverId);
    List<Review> findByPassengerId(Long passengerId);
    Optional<Review> findByBookingId(Long bookingId);
    boolean existsByBookingId(Long bookingId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.driver.id = :driverId")
    Double getAverageRatingByDriverId(Long driverId);
}