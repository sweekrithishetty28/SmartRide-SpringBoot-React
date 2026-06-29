package com.rideshare.ridesharing.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.LocalDateTime;

@Entity
@Table(name = "rides")
@Data
public class Ride {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "driver_id", nullable = false)
    private User driver;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String destination;

    @Column(nullable = false)
    private LocalDate rideDate;

    @Column(nullable = false)
    private LocalTime rideTime;

    @Column(nullable = false)
    private Integer availableSeats;

    @Column(nullable = false)
    private Double pricePerSeat;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RideStatus status = RideStatus.ACTIVE;

    @Column(updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    public enum RideStatus {
        ACTIVE, COMPLETED, CANCELLED
    }
    @Column
    private Double distanceKm;

}