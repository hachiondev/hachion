package com.hachionUserDashboard.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import com.hachionUserDashboard.entity.Course;
import com.hachionUserDashboard.entity.UserWishlist;

import Service.UserWishlistService;

@RestController
@RequestMapping("/api/wishlist")
public class UserWishlistController {

	private final UserWishlistService service;

	public UserWishlistController(UserWishlistService service) {
		this.service = service;
	}

	private String currentUserEmailOr401() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		if (auth == null || !auth.isAuthenticated() || "anonymousUser".equals(auth.getPrincipal())) {
			throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please login before bookmarking");
		}
		return auth.getName(); 
	}

	@PostMapping
	public ResponseEntity<Map<String, Object>> add(@RequestBody Map<String, Object> body) {
		String email = (String) body.get("email");
		Integer courseId = (Integer) body.get("courseId");

		if (email == null || email.isBlank()) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
		}
		if (courseId == null) {
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course ID is required");
		}

		service.add(email, courseId);

		
		return ResponseEntity.status(HttpStatus.CREATED)
				.body(Map.of("message", "Course bookmarked successfully", "email", email, "courseId", courseId));
	}

	@DeleteMapping("/{courseId}")
	public ResponseEntity<Void> remove(@PathVariable Integer courseId) {
		service.remove(currentUserEmailOr401(), courseId);
		return ResponseEntity.noContent().build();
	}

	@GetMapping
	public List<UserWishlist> listRaw() {
		return service.listRaw(currentUserEmailOr401());
	}

	@GetMapping("/courses")
	public List<Course> listCourses() {
		return service.listCourses(currentUserEmailOr401());
	}


	@GetMapping("/exists")
	public Map<String, Boolean> existsByEmailAndCourse(
	        @RequestParam String email,
	        @RequestParam Integer courseId) {
	    boolean bookmarked = service.exists(email, courseId);
	    return Map.of("bookmarked", bookmarked);
	}

	@PostMapping("/toggle")
	public ResponseEntity<Map<String, Object>> toggle(@RequestBody Map<String, Object> body) {
		String email = (String) body.get("email");
		Integer courseId = (Integer) body.get("courseId");

		if (email == null || email.isBlank())
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email is required");
		if (courseId == null)
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Course ID is required");

		boolean bookmarked = service.toggle(email, courseId);

		return ResponseEntity.ok(Map.of("message", bookmarked ? "Bookmarked" : "Unbookmarked", "email", email,
				"courseId", courseId, "bookmarked", bookmarked));
	}
}