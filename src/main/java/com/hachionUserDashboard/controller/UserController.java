package com.hachionUserDashboard.controller;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
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
import com.hachionUserDashboard.repository.RegisterStudentRepository;

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

	@Autowired
	private RegisterStudentRepository registerStudentRepository;

	@Value("${user.profile.image.upload.dir}")
	private String uploadDir;

	@Value("${spring.security.oauth2.client.registration.google.client-id}")
	private String clientId;
	
	
	 @Value("${app.frontend.base-url}")
	    private String feBase; // e.g. https://test.hachion.co or https://hachion.co

	    @Value("${app.frontend.paths.home:/}")
	    private String feHomePath;

	    @Value("${app.frontend.paths.login:/login}")
	    private String feLoginPath;

	    @Value("${app.frontend.paths.signup:/signup/collect-phone}")
	    private String feSignupPath;

	    // Cookie settings per env
	    @Value("${app.cookies.domain:}")
	    private String cookieDomain; // ".hachion.co" in test/prod, empty in dev

	    @Value("${app.cookies.secure:false}")
	    private boolean cookieSecure;

	    private String base() {
	        return feBase.endsWith("/") ? feBase.substring(0, feBase.length() - 1) : feBase;
	    }

	    private URI homeUri()   { return URI.create(base() + feHomePath); }
	    private URI loginUri()  { return URI.create(base() + feLoginPath); }
	    private URI signupUri() { return URI.create(base() + feSignupPath); }


//	@PostMapping("/send-otp")
//	public ResponseEntity<String> sendOtp(@RequestParam String email) {
//		if (email == null || email.isEmpty()) {
//			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required");
//		}
//
//		String response = userService.sendOtp(email);
//		return new ResponseEntity<>(response, HttpStatus.OK);
//	}
	@PostMapping("/send-otp")
	public ResponseEntity<Map<String, String>> sendOtp(@RequestParam String email) {
		if (email == null || email.isEmpty()) {
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message", "Email is required"));
		}

		String response = userService.sendOtp(email);
		return ResponseEntity.ok(Map.of("message", response));
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

		userService.registerApi(registrationRequest);

		return ResponseEntity.ok("Password updated successfully");
	}

	@PutMapping("/regenerate-otp")
	public ResponseEntity<String> regenerateOtp(@RequestParam String email) {
		return new ResponseEntity<>(userService.regenerateOtp(email), HttpStatus.OK);
	}

	@GetMapping("/students")
	public ResponseEntity<List<RegisterStudent>> getAllRegisteredStudents() {
		List<RegisterStudent> students = userService.getAllRegisteredStudents();
		return new ResponseEntity<>(students, HttpStatus.OK);
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
	public ResponseEntity<?> getUserProfile(
	        Authentication authentication,
	        @RequestParam(name = "flow", defaultValue = "login") String flow
	) throws URISyntaxException {

	    System.out.println("\n=== [/api/v1/user/profile] ===");
	    System.out.println("Flow (request param): " + flow);
	    System.out.println("Auth present       : " + (authentication != null));

	    if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User user)) {
	        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated"));
	    }

	    String email = user.getAttribute("email");
	    String username = user.getAttribute("name");

	    // ---- NEW: safely extract Google profile picture (OIDC preferred, fallback to attribute) ----
	    String picture = null;
	    if (authentication.getPrincipal() instanceof OidcUser oidc) {
	        picture = oidc.getPicture(); // same as (String) oidc.getAttribute("picture")
	    }
	    if (picture == null) {
	        picture = user.getAttribute("picture"); // may be null if scope not granted
	    }

	    // Build avatar cookie only if we actually have a picture URL
	    ResponseCookie avatarCookie = null;
	    if (picture != null && !picture.isBlank()) {
	        // URL-encode to be safe in cookie value
	        String enc = URLEncoder.encode(picture, StandardCharsets.UTF_8);
	        avatarCookie = ResponseCookie.from("avatar", enc)
	                .path("/")
	                .maxAge(86400)     // 1 day
	                .sameSite("Lax")
	                // .httpOnly(true)  // enable if you don't need JS to read it
	                 .secure(true)    // enable when serving over HTTPS
	                .build();
	        System.out.println("Avatar (picture) present, cookie prepared.");
	    } else {
	        System.out.println("No picture attribute from provider.");
	    }
	    // --------------------------------------------------------------------------------------------

	    if (email == null || email.isBlank()) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("error", "No email from provider"));
	    }

	    if ("signup".equalsIgnoreCase(flow)) {

	        RegisterStudent saved = userService.saveUser(username, email, picture);
	        System.out.println("Signup path -> saved userId=" + saved.getId() + ", email=" + saved.getEmail());

	        // Attach avatar cookie if present
	        if (avatarCookie != null) {
	            return ResponseEntity.status(HttpStatus.FOUND)
	                    .header(org.springframework.http.HttpHeaders.SET_COOKIE, avatarCookie.toString())
	                    .location(new java.net.URI("https://test.hachion.co"))
	                    .build();
	        } else {
	            return ResponseEntity.status(HttpStatus.FOUND)
	                    .location(new java.net.URI("https://test.hachion.co"))
	                    .build();
	        }

	    } else {
	        boolean exists = userService.findByEmailForProfile(email).isPresent();
	        if (!exists) {
	            System.out.println("Login path -> user not found for email=" + email);

	            org.springframework.http.ResponseCookie err =
	                    org.springframework.http.ResponseCookie.from("auth_error", "not_registered")
	                            .path("/")
	                            .maxAge(120)
	                            .sameSite("Lax")
	                            // .httpOnly(true)
	                             .secure(true)
	                            .build();

	            // If you prefer not to set avatar for non-registered users, omit avatarCookie here
	            if (avatarCookie != null) {
	                return ResponseEntity.status(HttpStatus.FOUND)
	                        .header(org.springframework.http.HttpHeaders.SET_COOKIE, err.toString())
	                        .header(org.springframework.http.HttpHeaders.SET_COOKIE, avatarCookie.toString())
	                        .location(new java.net.URI("https://test.hachion.co/login"))
	                        .build();
	            } else {
	                return ResponseEntity.status(HttpStatus.FOUND)
	                        .header(org.springframework.http.HttpHeaders.SET_COOKIE, err.toString())
	                        .location(new java.net.URI("https://test.hachion.co/login"))
	                        .build();
	            }
	        }

	        System.out.println("Login path -> user exists for email=" + email);

	        org.springframework.http.ResponseCookie clear =
	                org.springframework.http.ResponseCookie.from("auth_error", "")
	                        .path("/")
	                        .maxAge(0)
	                        .sameSite("Lax")
	                        .build();

	        // Set both: clear old auth_error and (if present) avatar
	        if (avatarCookie != null) {
	            return ResponseEntity.status(HttpStatus.FOUND)
	                    .header(org.springframework.http.HttpHeaders.SET_COOKIE, clear.toString())
	                    .header(org.springframework.http.HttpHeaders.SET_COOKIE, avatarCookie.toString())
	                    .location(new java.net.URI("https://test.hachion.co/"))
	                    .build();
	        } else {
	            return ResponseEntity.status(HttpStatus.FOUND)
	                    .header(org.springframework.http.HttpHeaders.SET_COOKIE, clear.toString())
	                    .location(new java.net.URI("https://test.hachion.co/"))
	                    .build();
	        }
	    }
	}



	@GetMapping("/signin")
	public ResponseEntity<?> signIn(Authentication authentication) throws URISyntaxException {
		if (authentication == null || !(authentication.getPrincipal() instanceof OAuth2User)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", "User not authenticated"));
		}

		OAuth2User oauth = (OAuth2User) authentication.getPrincipal();
		String email = oauth.getAttribute("email");
		String username = oauth.getAttribute("name");

		try {
			RegisterStudent user = userService.signInWithGoogle(email, username);

			java.net.URI redirect = new java.net.URI("https://test.hachion.co/");
			return ResponseEntity.status(HttpStatus.FOUND).location(redirect).build();

		} catch (NoSuchElementException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("error", "Account not found. Please sign up first."));
		}
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


	@PostMapping(value = "/reset-password", consumes = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<String> resetPasswordJson(@RequestBody UserRegistrationRequest request) {
		userService.resetPassword(request, null);
		return ResponseEntity.ok("Password updated successfully");
	}

	@PostMapping(value = "/reset-password", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> resetPasswordMultipart(@RequestPart("data") UserRegistrationRequest request,
			@RequestPart(value = "profileImage", required = false) MultipartFile profileImage) {
		userService.resetPassword(request, profileImage);
		return ResponseEntity.ok("Password updated successfully");
	}

	@GetMapping("/profile/{filename:.+}")
	public ResponseEntity<Resource> getProfileImage(@PathVariable String filename) {
		try {
			Path imagePath = Paths.get(uploadDir).resolve(filename).normalize();
			Resource resource = new UrlResource(imagePath.toUri());

			if (resource.exists() && resource.isReadable()) {
				// Dynamically detect content type
				String contentType = Files.probeContentType(imagePath);
				if (contentType == null) {
					contentType = "application/octet-stream"; // Fallback
				}

				return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
			} else {
				return ResponseEntity.notFound().build();
			}

		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PostMapping("/api/v1/user/complete-signup")
	public ResponseEntity<?> completeSignup(@AuthenticationPrincipal OidcUser oidc,
			@RequestBody Map<String, String> body) {
		if (oidc == null)
			return ResponseEntity.status(401).build();
		String email = oidc.getEmail();
		String phone = body.get("phone");

		RegisterStudent user = registerStudentRepository.findByEmail(email);
		if (user == null || !"PENDING".equalsIgnoreCase(user.getStatus())) {
			return ResponseEntity.badRequest().body(Map.of("error", "No pending signup for this user"));
		}

		// validate phone here …
//	  user.setPhone(phone);
		user.setStatus("ACTIVE");
		registerStudentRepository.save(user);

		return ResponseEntity.ok(Map.of("ok", true));
	}
}