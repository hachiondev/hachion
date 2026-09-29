package com.hachionUserDashboard.controller;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.repository.RegisterStudentRepository;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpSession;

@CrossOrigin(
		  origins = {"https://test.hachion.co","https://hachion.co","https://www.hachion.co"},
		  allowCredentials = "true",
		  allowedHeaders = "*",
		  methods = {
		    org.springframework.web.bind.annotation.RequestMethod.GET,
		    org.springframework.web.bind.annotation.RequestMethod.OPTIONS
		  }
		)

@RestController
@RequestMapping("/api")
public class GoogleSignupController {

	@Autowired
	private RegisterStudentRepository userRepository;

	@GetMapping("/public/health")
	public Map<String, String> health() {
		return Map.of("status", "ok");
	}

//	@GetMapping("/me")
//	public Map<String, Object> me(@AuthenticationPrincipal OidcUser user) {
//		
//		return Map.of("email", user.getEmail(), "name", user.getFullName());
//	}

	@GetMapping("/me")
	public ResponseEntity<?> me(@AuthenticationPrincipal OidcUser user) {
		if (user == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "Not authenticated"));
		}

		String email = user.getEmail();

		// Check in DB if user exists
		Optional<RegisterStudent> dbUser = userRepository.findByEmailForProfile(email); // <-- your UserRepository
		if (dbUser.isEmpty()) {
			// Clear authentication context (optional but recommended)
			SecurityContextHolder.clearContext();

			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("error", "User not found in system. Please sign up again."));
		}

		// Return the DB user data instead of just OIDC user info (keeps it consistent)
		RegisterStudent existing = dbUser.get();

		// Map.of() throws NullPointerException on any null value, and most
		// students have no profile_image (the Google login path never stores
		// one) - so right after a successful Google login this endpoint threw,
		// GlobalExceptionHandler turned it into a 400, and the frontend (which
		// treats any non-OK /api/me as "not logged in") showed the user as
		// logged out. A null-tolerant map keeps the same JSON shape.
		Map<String, Object> body = new LinkedHashMap<>();
		body.put("email", existing.getEmail());
		body.put("name", existing.getUserName() != null ? existing.getUserName() : user.getFullName());
		body.put("picture", existing.getProfileImage() != null ? existing.getProfileImage() : user.getPicture());
		return ResponseEntity.ok(body);
	}

	@PostMapping("/intent")
	public ResponseEntity<?> setIntent(@RequestBody Map<String, String> body, HttpServletRequest req) {
		String flow = "login";
		if ("signup".equalsIgnoreCase(body.getOrDefault("flow", "")))
			flow = "signup";
		HttpSession session = req.getSession(true);
		session.setAttribute("flow", flow);
		return ResponseEntity.ok(Map.of("ok", true, "flow", flow));
	}

}