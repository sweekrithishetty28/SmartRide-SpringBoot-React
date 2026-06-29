package com.rideshare.ridesharing.controller;

import com.rideshare.ridesharing.entity.Payment;
import com.rideshare.ridesharing.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.json.JSONObject;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/payment")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // Create Razorpay order
    @PostMapping("/create-order/{bookingId}")
    public ResponseEntity<String> createOrder(
            @PathVariable Long bookingId,
            Authentication auth) {
        try {
            JSONObject order = paymentService.createOrder(bookingId, auth.getName());
            return ResponseEntity.ok(order.toString());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Verify payment after success
    @PostMapping("/verify")
    public ResponseEntity<String> verifyPayment(
            @RequestBody Map<String, String> payload) {
        try {
            String result = paymentService.verifyPayment(
                    payload.get("razorpayOrderId"),
                    payload.get("razorpayPaymentId")
            );
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Get payment history
    @GetMapping("/my-payments")
    public ResponseEntity<List<Payment>> getMyPayments(Authentication auth) {
        return ResponseEntity.ok(paymentService.getMyPayments(auth.getName()));
    }
    // Driver sees their earnings
    @GetMapping("/my-earnings")
    public ResponseEntity<List<Payment>> getMyEarnings(Authentication auth) {
        return ResponseEntity.ok(paymentService.getDriverEarnings(auth.getName()));
    }
}