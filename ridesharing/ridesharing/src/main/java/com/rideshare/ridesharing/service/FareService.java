package com.rideshare.ridesharing.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.json.JSONArray;
import org.json.JSONObject;

@Service
public class FareService {

    @Value("${openroute.api.key}")
    private String apiKey;

    @Value("${openroute.base.fare}")
    private double baseFare;

    @Value("${openroute.rate.per.km}")
    private double ratePerKm;

    private final RestTemplate restTemplate = new RestTemplate();

    public double getDistanceInKm(String source, String destination) {
        try {
            double[] sourceCoords = getCoordinates(source);
            double[] destCoords = getCoordinates(destination);

            String url = "https://api.openrouteservice.org/v2/directions/driving-car"
                    + "?api_key=" + apiKey
                    + "&start=" + sourceCoords[1] + "," + sourceCoords[0]
                    + "&end=" + destCoords[1] + "," + destCoords[0];

            String response = restTemplate.getForObject(url, String.class);
            JSONObject json = new JSONObject(response);

            double distanceMeters = json
                    .getJSONArray("features")
                    .getJSONObject(0)
                    .getJSONObject("properties")
                    .getJSONArray("segments")
                    .getJSONObject(0)
                    .getDouble("distance");

            return Math.round((distanceMeters / 1000.0) * 10.0) / 10.0;

        } catch (Exception e) {
            System.out.println("ORS API error: " + e.getMessage());
            return -1;
        }
    }

    private double[] getCoordinates(String place) {
        String url = "https://api.openrouteservice.org/geocode/search"
                + "?api_key=" + apiKey
                + "&text=" + place.replace(" ", "+")
                + "&size=1";

        String response = restTemplate.getForObject(url, String.class);
        JSONObject json = new JSONObject(response);

        JSONArray coords = json
                .getJSONArray("features")
                .getJSONObject(0)
                .getJSONObject("geometry")
                .getJSONArray("coordinates");

        return new double[]{coords.getDouble(1), coords.getDouble(0)};
    }

    public double calculateTotalFare(double distanceKm) {
        if (distanceKm <= 0) return 0;
        double fare = baseFare + (ratePerKm * distanceKm);
        return Math.round(fare * 100.0) / 100.0;
    }

    public double getRatePerKm(double totalRouteKm) {
        if (totalRouteKm <= 0) return ratePerKm;
        double totalFare = calculateTotalFare(totalRouteKm);
        return Math.round((totalFare / totalRouteKm) * 100.0) / 100.0;
    }

    public double calculateProportionalFare(
            double totalRouteKm,
            double passengerDistanceKm,
            int seatsBooked) {

        if (totalRouteKm <= 0 || passengerDistanceKm <= 0) return 0;

        double actualPassengerKm = Math.min(passengerDistanceKm, totalRouteKm);
        double totalRouteFare = calculateTotalFare(totalRouteKm);
        double proportion = actualPassengerKm / totalRouteKm;
        double fare = totalRouteFare * proportion * seatsBooked;

        return Math.round(fare * 100.0) / 100.0;
    }

    public double calculatePricePerSeat(double totalRouteKm, int totalSeats) {
        if (totalSeats <= 0) return calculateTotalFare(totalRouteKm);
        double totalFare = calculateTotalFare(totalRouteKm);
        return Math.round((totalFare / totalSeats) * 100.0) / 100.0;
    }
}