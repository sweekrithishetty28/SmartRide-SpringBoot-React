package com.rideshare.ridesharing.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "ride_id", nullable = false)
    private Ride ride;

    @ManyToOne
    @JoinColumn(name = "passenger_id", nullable = false)
    private User passenger;

    @Column(nullable = false)
    private Integer seatsBooked;

    @Column(nullable = false)
    private Double totalFare;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BookingStatus status = BookingStatus.CONFIRMED;

    @Column(updatable = false)
    private LocalDateTime bookedAt = LocalDateTime.now();

    public enum BookingStatus {
        CONFIRMED, CANCELLED, COMPLETED
    }
    // Where passenger boards and exits
    private String pickupPoint;
    private String dropoffPoint;
    private Double passengerDistanceKm;

    @Column(nullable = false)
    private Boolean isPaid = false;

    public Boolean getPaid() {
        return isPaid;
    }

    public void setPaid(Boolean paid) {
        this.isPaid = paid;
    }
}