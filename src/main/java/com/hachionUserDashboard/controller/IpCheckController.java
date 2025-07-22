package com.hachionUserDashboard.controller;

import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api")
public class IpCheckController {

    private static final Set<String> BLOCKED_IPS = Set.of(
        "152.59.179.65",    // Shreya
        "103.88.236.42",    // Ramakrishna
        "49.42.213.67",     // Puspa
        "106.221.185.77",   // Ajay
        "223.185.47.23",    // Prasanna
        "52.59.202.123",    // Tarun
        "152.57.170.218",   // Hyderabad
        "117.207.227.250",  // Punjab
        "49.37.65.201",     // Niru
        "45.249.79.113",     //lakshmi
        "157.49.40.238",    //satyam
        "152.57.233.70"     //sirisha
    );

    @PostMapping("/check-ip")
    public ResponseEntity<?> checkIp(HttpServletRequest request) {
        String ip = extractClientIp(request);
        System.out.println("Client IP: " + ip);
        if (ip != null && BLOCKED_IPS.contains(ip)) {
        	System.out.println("Client IP: " + ip);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Blocked IP");
        }
        return ResponseEntity.ok("Allowed");
    }

    private String extractClientIp(HttpServletRequest request) {
        String header = request.getHeader("X-Forwarded-For");
        if (header != null && !header.isEmpty()) {
            return header.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}