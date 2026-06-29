package com.rideshare.ridesharing.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.rideshare.ridesharing.entity.*;
import com.rideshare.ridesharing.repository.*;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final UserRepository userRepository;

    @Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    // Step 1 — Create Razorpay order
    public JSONObject createOrder(Long bookingId, String passengerEmail) throws Exception {

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new RuntimeException("Booking not found!"));

        User passenger = userRepository.findByEmail(passengerEmail)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        // Check if payment already completed
        paymentRepository.findByBookingId(bookingId).ifPresent(p -> {
            if (p.getStatus() == Payment.PaymentStatus.SUCCESS) {
                throw new RuntimeException("Payment already completed!");
            }
        });

        // Amount in paise (multiply by 100)
        long amountInPaise = (long) (booking.getTotalFare() * 100);

        RazorpayClient client = new RazorpayClient(razorpayKeyId, razorpayKeySecret);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", (long) amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "booking_" + bookingId.toString());

        Order order = client.orders.create(orderRequest);

        // Save payment as PENDING
        Payment payment = paymentRepository.findByBookingId(bookingId)
                .orElse(new Payment());
        payment.setBooking(booking);
        payment.setPassenger(passenger);
        payment.setAmount(booking.getTotalFare());
        payment.setRazorpayOrderId(order.get("id").toString());
        payment.setStatus(Payment.PaymentStatus.PENDING);
        paymentRepository.save(payment);

        // Build response
        JSONObject response = new JSONObject();
        response.put("orderId", order.get("id").toString());
        response.put("amount", (long) amountInPaise);
        response.put("currency", "INR");
        response.put("keyId", razorpayKeyId);
        response.put("bookingId", bookingId.toString());
        response.put("passengerName", passenger.getName());
        response.put("passengerEmail", passenger.getEmail());

        return response;
    }

    // Step 2 — Verify payment after success
    public String verifyPayment(String razorpayOrderId,
                                String razorpayPaymentId) {

        Payment payment = paymentRepository.findByRazorpayOrderId(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Payment not found!"));

        payment.setRazorpayPaymentId(razorpayPaymentId);
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        // Mark booking as paid
        Booking booking = payment.getBooking();
        booking.setIsPaid(true);
        bookingRepository.save(booking);

        System.out.println("Booking " + booking.getId() + " marked as PAID");

        return "Payment verified successfully!";
    }


    // Get all payments by passenger
    public List<Payment> getMyPayments(String passengerEmail) {
        User passenger = userRepository.findByEmail(passengerEmail)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return paymentRepository.findByPassengerId(passenger.getId());
    }
    // Called when driver marks ride as completed
    public void releasePaymentToDriver(Long rideId) {
        List<Booking> bookings = bookingRepository.findByRideId(rideId);
        for (Booking booking : bookings) {
            paymentRepository.findByBookingId(booking.getId()).ifPresent(payment -> {
                if (payment.getStatus() == Payment.PaymentStatus.SUCCESS
                        && !payment.getDriverPaid()) {
                    payment.setDriver(booking.getRide().getDriver());
                    payment.setDriverPaid(true);
                    payment.setDriverPaidAt(LocalDateTime.now());
                    paymentRepository.save(payment);
                    System.out.println("Driver paid for booking: " + booking.getId());
                }
            });
        }
    }

    // Get driver earnings
    public List<Payment> getDriverEarnings(String driverEmail) {
        User driver = userRepository.findByEmail(driverEmail)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        return paymentRepository.findByDriverIdAndDriverPaid(driver.getId(), true);
    }
}