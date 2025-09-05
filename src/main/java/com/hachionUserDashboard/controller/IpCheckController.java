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
			"152.59.182.27", // Shreya
			"103.88.236.42", // Ramakrishna
			"49.42.209.112", // Puspa
			"106.221.182.112", // Ajay
			"223.185.51.103", // Prasanna
			"152.59.202.216", // Tarun
			"152.57.170.218", // Hyderabad
			"117.207.230.172", // Punjab
			"49.37.65.201", // Niru
			"157.49.40.238", // satyam
			"152.57.233.70", // sirisha
			"45.249.79.116", // lakshmi
			"107.217.160.147", // prasad sir
			"192.168.1.77", // prasad sir
			"152.59.200.49",//sirisha
			"49.36.236.51"     //sejal
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
//@RestController
//@RequestMapping("/api")
//public class IpCheckController {
//
//	private static final Set<String> BLOCKED_IPS = Set.of(
//			"152.59.179.65", // Shreya
//			"103.88.236.42", // Ramakrishna
//			"49.42.209.112", // Puspa
//			"106.221.185.77", // Ajay
//			"223.185.51.103", // Prasanna
//			"52.59.202.123", // Tarun
//			"152.57.170.218", // Hyderabad
//			"117.207.230.172", // Punjab
//			"49.37.65.201", // Niru
//			"157.49.40.238", // satyam
//			"152.57.233.70", // sirisha
//			"45.249.79.116", // lakshmi
//			"107.217.160.147", //prasad sir
//			"192.168.1.77" //prasad sir
//	);
//
//	private static final Set<String> BLOCKED_PATHS = Set.of("https://hachion.co/admindashboardview", "https://hachion.co/adminlogin");
//
//	@PostMapping("/check-ip")
//	public ResponseEntity<?> checkIp(HttpServletRequest request) {
//		String ip = extractClientIp(request);
//		String uri = request.getRequestURI();
//
//		System.out.println("Client IP: " + ip);
//		System.out.println("Request URI: " + uri);
//
//		if ((ip != null && BLOCKED_IPS.contains(ip)) || BLOCKED_PATHS.contains(uri)) {
//			System.out.println("Blocked access from IP: " + ip + " or URI: " + uri);
//			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
//		}
//
//		return ResponseEntity.ok("Allowed");
//	}
//
//	private String extractClientIp(HttpServletRequest request) {
//		String header = request.getHeader("X-Forwarded-For");
//		if (header != null && !header.isEmpty()) {
//			return header.split(",")[0].trim();
//		}
//		return request.getRemoteAddr();
//	}
//}
