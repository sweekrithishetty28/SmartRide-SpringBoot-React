package com.rideshare.ridesharing.service;

import com.rideshare.ridesharing.dto.*;
import com.rideshare.ridesharing.entity.*;
import com.rideshare.ridesharing.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RideService {

    private final RideRepository rideRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;
    private final FareService fareService;
    private final PaymentService paymentService;

    public String postRide(RideRequest request, String driverEmail) {
        User driver = userRepository.findByEmail(driverEmail)
                .orElseThrow(() -> new RuntimeException("Driver not found!"));

        if (driver.getRole() != User.Role.DRIVER) {
            throw new RuntimeException("Only drivers can post rides!");
        }

        double distanceKm = fareService.getDistanceInKm(
                request.getSource(), request.getDestination()
        );

        double pricePerSeat;
        if (distanceKm > 0) {
            pricePerSeat = fareService.calculatePricePerSeat(
                    distanceKm, request.getAvailableSeats()
            );
        } else {
            pricePerSeat = request.getPricePerSeat();
        }

        Ride ride = new Ride();
        ride.setDriver(driver);
        ride.setSource(request.getSource());
        ride.setDestination(request.getDestination());
        ride.setRideDate(request.getRideDate());
        ride.setRideTime(request.getRideTime());
        ride.setAvailableSeats(request.getAvailableSeats());
        ride.setPricePerSeat(pricePerSeat);
        ride.setDistanceKm(distanceKm > 0 ? distanceKm : 0);

        rideRepository.save(ride);
        return "Ride posted! Distance: " + distanceKm
                + " km | Price per seat: ₹" + pricePerSeat;
    }

    public List<Ride> searchRides(String source, String destination, LocalDate date) {
        return rideRepository
                .findBySourceContainingIgnoreCaseAndDestinationContainingIgnoreCaseAndRideDateAndStatusAndAvailableSeatsGreaterThan(
                        source, destination, date, Ride.RideStatus.ACTIVE, 0
                );
    }

    public String bookRide(BookingRequest request, String passengerEmail) {
        User passenger = userRepository.findByEmail(passengerEmail)
                .orElseThrow(() -> new RuntimeException("Passenger not found!"));

        Ride ride = rideRepository.findById(request.getRideId())
                .orElseThrow(() -> new RuntimeException("Ride not found!"));

        if (ride.getStatus() != Ride.RideStatus.ACTIVE) {
            throw new RuntimeException("This ride is not available!");
        }

        if (ride.getAvailableSeats() < request.getSeatsBooked()) {
            throw new RuntimeException("Not enough seats available!");
        }

        double totalRouteKm = ride.getDistanceKm() != null ? ride.getDistanceKm() : 0;
        double passengerDistanceKm;
        double totalFare;

        // ── Fixed isPartialRoute check ──
        boolean hasPickup = request.getPickupPoint() != null
                && !request.getPickupPoint().trim().isEmpty();
        boolean hasDropoff = request.getDropoffPoint() != null
                && !request.getDropoffPoint().trim().isEmpty();

        boolean isPartialRoute = hasPickup && hasDropoff && (
                !request.getPickupPoint().trim().equalsIgnoreCase(ride.getSource().trim()) ||
                        !request.getDropoffPoint().trim().equalsIgnoreCase(ride.getDestination().trim())
        );

        System.out.println("isPartialRoute: " + isPartialRoute);
        System.out.println("pickup: " + request.getPickupPoint());
        System.out.println("dropoff: " + request.getDropoffPoint());
        System.out.println("ride source: " + ride.getSource());
        System.out.println("ride destination: " + ride.getDestination());

        if (isPartialRoute) {
            // Get passenger's actual distance
            passengerDistanceKm = fareService.getDistanceInKm(
                    request.getPickupPoint().trim(),
                    request.getDropoffPoint().trim()
            );

            System.out.println("passengerDistanceKm from API: " + passengerDistanceKm);

            if (passengerDistanceKm <= 0) {
                // API failed — fallback to full route
                passengerDistanceKm = totalRouteKm;
            }

            // Proportional fare
            if (totalRouteKm > 0) {
                totalFare = fareService.calculateProportionalFare(
                        totalRouteKm,
                        passengerDistanceKm,
                        request.getSeatsBooked()
                );
            } else {
                totalFare = ride.getPricePerSeat() * request.getSeatsBooked();
            }
        } else {
            // Full route — use pricePerSeat directly
            passengerDistanceKm = totalRouteKm;
            totalFare = ride.getPricePerSeat() * request.getSeatsBooked();
        }

        System.out.println("Final passengerDistanceKm: " + passengerDistanceKm);
        System.out.println("Final totalFare: " + totalFare);

        Booking booking = new Booking();
        booking.setRide(ride);
        booking.setPassenger(passenger);
        booking.setSeatsBooked(request.getSeatsBooked());
        booking.setPickupPoint(hasPickup
                ? request.getPickupPoint().trim() : ride.getSource());
        booking.setDropoffPoint(hasDropoff
                ? request.getDropoffPoint().trim() : ride.getDestination());
        booking.setPassengerDistanceKm(passengerDistanceKm);
        booking.setTotalFare(totalFare);

        ride.setAvailableSeats(ride.getAvailableSeats() - request.getSeatsBooked());
        rideRepository.save(ride);
        bookingRepository.save(booking);

        return String.format(
                "Ride booked! Your distance: %.1f km | Fare: ₹%.2f",
                passengerDistanceKm, totalFare
        );
    }

    public List<Ride> getMyRides(String driverEmail) {
        User driver = userRepository.findByEmail(driverEmail)
                .orElseThrow(() -> new RuntimeException("Driver not found!"));
        return rideRepository.findByDriverId(driver.getId());
    }

    public List<Booking> getMyBookings(String passengerEmail) {
        User passenger = userRepository.findByEmail(passengerEmail)
                .orElseThrow(() -> new RuntimeException("Passenger not found!"));
        return bookingRepository.findByPassengerId(passenger.getId());
    }

    public String cancelBooking(Long bookingId, String passengerEmail) {
        User passenger = userRepository.findByEmail(passengerEmail)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found!"));

        if (!booking.getPassenger().getId().equals(passenger.getId())) {
            throw new RuntimeException("You can only cancel your own bookings!");
        }

        if (booking.getStatus() == Booking.BookingStatus.CANCELLED) {
            throw new RuntimeException("Booking is already cancelled!");
        }

        Ride ride = booking.getRide();
        ride.setAvailableSeats(ride.getAvailableSeats() + booking.getSeatsBooked());
        rideRepository.save(ride);

        booking.setStatus(Booking.BookingStatus.CANCELLED);
        bookingRepository.save(booking);

        return "Booking cancelled successfully!";
    }

    public String cancelRide(Long rideId, String driverEmail) {
        User driver = userRepository.findByEmail(driverEmail)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found!"));

        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("You can only cancel your own rides!");
        }

        if (ride.getStatus() == Ride.RideStatus.CANCELLED) {
            throw new RuntimeException("Ride is already cancelled!");
        }

        ride.setStatus(Ride.RideStatus.CANCELLED);
        rideRepository.save(ride);

        return "Ride cancelled successfully!";
    }

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }

    public String updateProfile(String email, RegisterRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        user.setName(request.getName());
        user.setPhone(request.getPhone());

        if (user.getRole() == User.Role.DRIVER) {
            user.setCarModel(request.getCarModel());
            user.setLicensePlate(request.getLicensePlate());
            user.setSeatCapacity(request.getSeatCapacity());
        }

        userRepository.save(user);
        return "Profile updated successfully!";
    }

    public String completeRide(Long rideId, String driverEmail) {
        User driver = userRepository.findByEmail(driverEmail)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Ride not found!"));

        if (!ride.getDriver().getId().equals(driver.getId())) {
            throw new RuntimeException("You can only complete your own rides!");
        }

        if (ride.getStatus() == Ride.RideStatus.CANCELLED) {
            throw new RuntimeException("Cancelled ride cannot be completed!");
        }

        if (ride.getStatus() == Ride.RideStatus.COMPLETED) {
            throw new RuntimeException("Ride is already completed!");
        }

        ride.setStatus(Ride.RideStatus.COMPLETED);
        rideRepository.save(ride);

        // Release payment to driver
        paymentService.releasePaymentToDriver(rideId);

        List<Booking> bookings = bookingRepository.findByRideId(rideId);
        for (Booking booking : bookings) {
            if (booking.getStatus() == Booking.BookingStatus.CONFIRMED) {
                booking.setStatus(Booking.BookingStatus.COMPLETED);
                bookingRepository.save(booking);
            }
        }

        return "Ride marked as completed!";
    }
}