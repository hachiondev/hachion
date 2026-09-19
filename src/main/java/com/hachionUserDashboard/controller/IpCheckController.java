package com.hachionUserDashboard.controller;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
//
//@RestController
//@RequestMapping("/api")
//public class IpCheckController {
//
//	private static final Set<String> BLOCKED_IPS = Set.of(
//			"152.59.182.27", // Shreya
//			"103.88.236.42", // Ramakrishna
//			"49.42.209.112", // Puspa
//			"106.221.182.112", // Ajay
//			"223.185.51.103", // Prasanna
//			"152.59.202.216", // Tarun
//			"152.57.170.218", // Hyderabad
//			"117.207.230.172", // Punjab
//			"49.37.65.201", // Niru
//			"157.49.40.238", // satyam
//			"152.57.233.70", // sirisha
//			"45.249.79.116", // lakshmi
//			"107.217.160.147", // prasad sir
//			"192.168.1.77", // prasad sir
//			"152.59.200.49",//sirisha
//			"49.36.236.51",     //sejal,
//			"49.37.66.88",
//			"45.249.79.113",
//			"2409:40e3:30aa:7ce3:1115:2bfa:bf46:c091",
//			"49.204.13.220",
//			"49.204.9.240",
//			"152.58.154.169",
//			"49.204.8.162",
//			"49.204.10.155"
//	);
//
//	@PostMapping("/check-ip")
//	public ResponseEntity<?> checkIp(HttpServletRequest request) {
//		String ip = extractClientIp(request);
//		System.out.println("Client IP: " + ip);
//		if (ip != null && BLOCKED_IPS.contains(ip)) {
//			System.out.println("Client IP: " + ip);
//			return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Blocked IP");
//		}
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

@RestController
@RequestMapping("/api")
public class IpCheckController {

	private static final Set<String> BLOCKED_IPS = Set.of("152.59.182.27", "103.88.236.42", "49.42.209.112",
			"106.221.182.112", "223.185.51.103", "152.59.202.216", "152.57.170.218", "117.207.230.172", "49.37.65.201",
			"157.49.40.238", "152.57.233.70",
			"107.217.160.147", "192.168.1.77", "152.59.200.49", "49.36.236.51", "49.37.66.88", "45.249.79.113",
			"2409:40e3:30aa:7ce3:1115:2bfa:bf46:c091", "49.204.13.220", "49.204.9.240", "152.58.154.169",
			"49.204.8.162", "49.204.10.155");

	private static final Set<String> BLOCKED_LOCATIONS = Set.of("ranchi, jharkhand", "tadepalle, andhra pradesh",
			"hyderabad, telangana", "lucknow, uttar pradesh", "uttar pradesh", "hyderabad", "telangana",
			"yanam, puducherry", "null", "faizabad, uttar pradesh", "jaipur, rajasthan", "abohar, punjab","pulivendula, andhra pradesh",
			"bhagur, maharashtra", "madanapalle, andhra pradesh", "kabirpur, odisha", "kolkata, west bengal");

	private static final boolean BLOCK_WHEN_LOCATION_UNKNOWN = false;
	private static final boolean BLOCK_WHEN_IP_UNKNOWN = false;

	@PostMapping("/check-ip")
	public ResponseEntity<?> checkIp(HttpServletRequest request,
			@RequestHeader(value = "X-Debug-Ip", required = false) String dbgIpHdr,
			@RequestHeader(value = "X-Debug-Location", required = false) String dbgLocHdr,
			@RequestParam(value = "debugIp", required = false) String dbgIpParam,
			@RequestParam(value = "debugLocation", required = false) String dbgLocParam) {
		
		String ip = firstNonBlank(dbgIpHdr, dbgIpParam, extractClientIp(request));
		String loc = firstNonBlank(dbgLocHdr, dbgLocParam, resolveCityState(ip));
		String normLoc = normalize(loc);

		boolean ipKnown = ip != null && !ip.isBlank();
		boolean locKnown = normLoc != null && !normLoc.isBlank() && !"null".equals(normLoc);

		if (ipKnown && locKnown) {
			
			if (BLOCKED_IPS.contains(ip)) {
				return block("blocked_by_ip", ip, normLoc);
			}
			if (BLOCKED_LOCATIONS.contains(normLoc)) {
				return block("blocked_by_location", ip, normLoc);
			}
			return allow("allowed_both_present", ip, normLoc);
		}

	
		if (ipKnown && !locKnown) {
			
			if (BLOCKED_IPS.contains(ip)) {
				return block("blocked_by_ip_only", ip, normLoc);
			}
			if (BLOCK_WHEN_LOCATION_UNKNOWN) {
				return block("blocked_location_unknown_policy", ip, normLoc);
			}
			return allow("allowed_ip_only", ip, normLoc);
		}

		
		if (!ipKnown && locKnown) {
			
			if (BLOCKED_LOCATIONS.contains(normLoc)) {
				return block("blocked_by_location_only", ip, normLoc);
			}
			if (BLOCK_WHEN_IP_UNKNOWN) {
				return block("blocked_ip_unknown_policy", ip, normLoc);
			}
			return allow("allowed_location_only", ip, normLoc);
		}

		
		if (BLOCK_WHEN_IP_UNKNOWN || BLOCK_WHEN_LOCATION_UNKNOWN) {
			return block("blocked_both_unknown_policy", ip, normLoc);
		}
		return allow("allowed_both_unknown", ip, normLoc);
	}

	
	private static ResponseEntity<Map<String, Object>> block(String reason, String ip, String loc) {
		
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("status", "blocked");
		body.put("reason", reason);
		body.put("ip", ip);
		body.put("location", loc);
		return ResponseEntity.status(HttpStatus.FORBIDDEN).body(body);
	}

	private static ResponseEntity<Map<String, Object>> allow(String reason, String ip, String loc) {
		
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("status", "allowed");
		body.put("reason", reason);
		body.put("ip", ip);
		body.put("location", loc);
		return ResponseEntity.ok(body);
	}

	private String extractClientIp(HttpServletRequest request) {
		String xff = request.getHeader("X-Forwarded-For");
		if (xff != null && !xff.isBlank()) {
			String first = xff.split(",")[0].trim();
			if (!first.isEmpty())
				return first;
		}
		return request.getRemoteAddr();
	}

	private static String normalize(String s) {
		if (s == null)
			return null;
		String noAccents = java.text.Normalizer.normalize(s, java.text.Normalizer.Form.NFD).replaceAll("\\p{M}+", "");
		String ascii = noAccents.replaceAll("[^\\p{Alnum}\\s,]", "");
		return ascii.toLowerCase().trim().replaceAll("\\s+", " ");
	}

	private String resolveCityState(String ip) {
		try {
			if (ip == null || ip.isBlank())
				return "null";
			String urlStr = "https://ipwho.is/"
					+ java.net.URLEncoder.encode(ip, java.nio.charset.StandardCharsets.UTF_8);
			java.net.HttpURLConnection conn = (java.net.HttpURLConnection) new java.net.URL(urlStr).openConnection();
			conn.setConnectTimeout(2500);
			conn.setReadTimeout(2500);
			conn.setRequestMethod("GET");
			int code = conn.getResponseCode();
			java.io.InputStream is = (code >= 200 && code < 300) ? conn.getInputStream() : conn.getErrorStream();
			String json = new String(is.readAllBytes(), java.nio.charset.StandardCharsets.UTF_8);
			com.fasterxml.jackson.databind.ObjectMapper om = new com.fasterxml.jackson.databind.ObjectMapper();
			com.fasterxml.jackson.databind.JsonNode root = om.readTree(json);
			if (root.has("success") && !root.path("success").asBoolean())
				return "null";
			String city = normalize(root.path("city").asText(null));
			String region = normalize(root.path("region").asText(null));
			String resolved = "null";
			if (city != null && !city.isBlank() && region != null && !region.isBlank()) {
				resolved = city + ", " + region;
			} else if (region != null && !region.isBlank()) {
				resolved = region;
			} else if (city != null && !city.isBlank()) {
				resolved = city;
			}
			
			return resolved;
		} catch (Exception e) {
			
			return "null";
		}
	}

	private static String firstNonBlank(String... vals) {
		if (vals == null)
			return null;
		for (String v : vals) {
			if (v != null && !v.isBlank())
				return v;
		}
		return null;
	}
}
