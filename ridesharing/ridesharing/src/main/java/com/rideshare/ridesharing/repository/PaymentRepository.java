package com.rideshare.ridesharing.repository;

import com.rideshare.ridesharing.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByPassengerId(Long passengerId);
    Optional<Payment> findByRazorpayOrderId(String orderId);
    Optional<Payment> findByBookingId(Long bookingId);
    List<Payment> findByDriverIdAndDriverPaid(Long driverId, Boolean driverPaid);
    List<Payment> findByDriverId(Long driverId);
}