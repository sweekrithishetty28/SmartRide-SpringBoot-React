package com.rideshare.ridesharing.service;

import com.rideshare.ridesharing.dto.ReviewRequest;
import com.rideshare.ridesharing.entity.*;
import com.rideshare.ridesharing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    // Passenger submits review after completed ride
    public String submitReview(ReviewRequest request, String passengerEmail) {

        User passenger = userRepository.findByEmail(passengerEmail)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new RuntimeException("Booking not found!"));

        // Only passenger of this booking can review
        if (!booking.getPassenger().getId().equals(passenger.getId())) {
            throw new RuntimeException("You can only review your own bookings!");
        }

        // Only completed bookings can be reviewed
        if (booking.getStatus() != Booking.BookingStatus.COMPLETED) {
            throw new RuntimeException("You can only review completed rides!");
        }

        // Check if already reviewed
        if (reviewRepository.existsByBookingId(request.getBookingId())) {
            throw new RuntimeException("You have already reviewed this ride!");
        }

        Review review = new Review();
        review.setBooking(booking);
        review.setPassenger(passenger);
        review.setDriver(booking.getRide().getDriver());
        review.setRating(request.getRating());
        review.setComment(request.getComment());

        reviewRepository.save(review);
        return "Review submitted successfully!";
    }

    // Get all reviews for a driver
    public List<Review> getDriverReviews(Long driverId) {
        return reviewRepository.findByDriverId(driverId);
    }

    // Get average rating of a driver
    public Double getDriverAverageRating(Long driverId) {
        Double avg = reviewRepository.getAverageRatingByDriverId(driverId);
        if (avg == null) return 0.0;
        return Math.round(avg * 10.0) / 10.0;
    }

    // Check if booking already reviewed
    public boolean isReviewed(Long bookingId) {
        return reviewRepository.existsByBookingId(bookingId);
    }
}