package com.hachionUserDashboard.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.CompletionDateResponse;
import com.hachionUserDashboard.dto.CourseUserRequest;
import com.hachionUserDashboard.dto.LoginRequest;
import com.hachionUserDashboard.dto.OtpRequest;
import com.hachionUserDashboard.dto.StudentInfoResponse;
import com.hachionUserDashboard.dto.UserRegistrationRequest;
import com.hachionUserDashboard.entity.RegisterStudent;

import Response.LoginResponse;
import Response.UserProfileResponse;
import Service.UserService;
import jakarta.mail.MessagingException;

@CrossOrigin
@RestController
@RequestMapping("/api/v1/user")
public class UserController {

	@Autowired
	private UserService userService;

	@PostMapping("/send-otp")
	public ResponseEntity<String> sendOtp(@RequestParam String email) {
		if (email == null || email.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required");
		}

		String response = userService.sendOtp(email);
		return new ResponseEntity<>(response, HttpStatus.OK);
	}

	@PostMapping("/verify-otp")
	public ResponseEntity<String> verifyOtp(@RequestBody OtpRequest otpRequest) {

		String response = userService.verifyOtp(otpRequest.getEmail(), otpRequest.getOtp());

		if (response.equals("User verified successfully with OTP.")) {
			return new ResponseEntity<>(response, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
		}
	}

	@PutMapping("/register")
	public ResponseEntity<?> updatePassword(@RequestBody UserRegistrationRequest registrationRequest)
			throws MessagingException {

		userService.updatePassword(registrationRequest);

		return ResponseEntity.ok("Password updated successfully");
	}

	@GetMapping("/students")
	public ResponseEntity<List<RegisterStudent>> getAllRegisteredStudents() {
		List<RegisterStudent> students = userService.getAllRegisteredStudents();
		return new ResponseEntity<>(students, HttpStatus.OK);
	}

	@PutMapping("/regenerate-otp")
	public ResponseEntity<String> regenerateOtp(@RequestParam String email) {
		return new ResponseEntity<>(userService.regenerateOtp(email), HttpStatus.OK);
	}

	@PostMapping("/login")
	public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
		LoginResponse loginResponse = userService.LoginUser(loginRequest);
		return ResponseEntity.ok(loginResponse);

	}

	@PutMapping("/forgotpassword")
	public ResponseEntity<String> forgotpassword(@RequestParam String email) {
		return new ResponseEntity<>(userService.forgotpassword(email), HttpStatus.OK);
	}

	@PutMapping("/setpassword")
	public ResponseEntity<String> setpassword(@RequestParam String email, @RequestHeader String newPassword) {
		return new ResponseEntity(userService.setpassword(email, newPassword), HttpStatus.OK);
	}

	@GetMapping("/profile")
	public ResponseEntity<?> getUserProfile(Authentication authentication) {
		System.out.println("Authentication: " + authentication);

		if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated"));
		}

		OAuth2User user = (OAuth2User) authentication.getPrincipal();
		System.out.println("OAuth2User: " + user);

		String email = user.getAttribute("email");
		String username = user.getAttribute("name");

		RegisterStudent savedUser = userService.saveUser(username, email);

		return ResponseEntity.ok(Map.of("email", savedUser.getEmail(), "name", savedUser.getUserName()));
	}

	@GetMapping("/login2")
	public String login() {
		System.out.println("From login api");
		return "Successfully Login";
	}

	
	@GetMapping("/students/{courseName}")
	public ResponseEntity<List<StudentInfoResponse>> getStudentsByCourse(@PathVariable String courseName) {
		List<StudentInfoResponse> students = userService.getStudentsByCourse(courseName);
		return ResponseEntity.ok(students);
	}

	@GetMapping("/lookup")
	public ResponseEntity<?> getStudentInfo(@RequestParam(required = false) String studentId,
			@RequestParam(required = false) String userName) {
		try {
			StudentInfoResponse response = userService.getStudentInfo(studentId, userName);
			return ResponseEntity.ok(response);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@PostMapping("/completiondate")
	public ResponseEntity<?> getCompletionDate(@RequestBody CourseUserRequest request) {
		try {
			CompletionDateResponse response = userService.getCompletionDate(request.getCourseName(),
					request.getUserName());
			return ResponseEntity.ok(response);
		} catch (RuntimeException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		}
	}

	@GetMapping("/myprofile")
	public ResponseEntity<UserProfileResponse> getUserProfile(@RequestParam String email) {
		UserProfileResponse profile = userService.getUserProfileByEmail(email);
		return ResponseEntity.ok(profile);
	}

//	@PostMapping("/reset-password")
//	public ResponseEntity<String> resetPassword(@RequestBody UserRegistrationRequest request) {
//		userService.resetPassword(request);
//		return ResponseEntity.ok("Password updated successfully");
//	}
	@PostMapping("/reset-password")
	public ResponseEntity<String> resetPassword(
	    @RequestPart("data") UserRegistrationRequest request,
	    @RequestPart(value = "profileImage", required = false) MultipartFile profileImage
	) {
	    userService.resetPassword(request, profileImage);
	    return ResponseEntity.ok("Password updated successfully");
	}
	
	@GetMapping("/profile/{filename:.+}")
	public ResponseEntity<Resource> getProfileImage(@PathVariable String filename) {
	    try {
	        Path imagePath = Paths.get("uploads/profile_images").resolve(filename).normalize();
	        Resource resource = new UrlResource(imagePath.toUri());

	        if (resource.exists() && resource.isReadable()) {
	            // Dynamically detect content type
	            String contentType = Files.probeContentType(imagePath);
	            if (contentType == null) {
	                contentType = "application/octet-stream"; // Fallback
	            }

	            return ResponseEntity.ok()
	                    .contentType(MediaType.parseMediaType(contentType))
	                    .body(resource);
	        } else {
	            return ResponseEntity.notFound().build();
	        }

	    } catch (IOException e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
	    }
	}
}