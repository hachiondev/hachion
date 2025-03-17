////package com.hachionUserDashboard.controller;
////
////import java.util.Optional;
////
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.http.HttpStatus;
////import org.springframework.http.ResponseEntity;
////import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
////import org.springframework.web.bind.annotation.PostMapping;
////import org.springframework.web.bind.annotation.RequestBody;
////import org.springframework.web.bind.annotation.RequestMapping;
////import org.springframework.web.bind.annotation.RestController;
////
////import com.hachionUserDashboard.dto.LoginRequest;
////import com.hachionUserDashboard.dto.OtpRequest;
////import com.hachionUserDashboard.dto.UserRegistrationRequest;
////import com.hachionUserDashboard.entity.RegisterUser;
////import com.hachionUserDashboard.repository.RegisterUserRepository;
////import com.hachionUserDashboard.repository.UserRepository;
////import com.hachionUserDashboard.service.EmailService;
////import com.hachionUserDashboard.service.OtpService;
////import com.hachionUserDashboard.service.UserService;
////import com.hachionUserDashboard.util.JwtUtil;
////
////
////
////@RestController
////@RequestMapping("/auth")
////public class AuthController {
////	
////	@Autowired
////    private UserRepository userRepository;
////    
////    @Autowired
////    private RegisterUserRepository registerUserRepository;
////
////    @Autowired
////    private OtpService otpService;
////
////    @Autowired
////    private EmailService emailService;
////    
////    @Autowired
////    private UserService userService;
////
////    @Autowired
////    private JwtUtil jwtUtil; // Ensure you have a JwtUtil class for token generation
////
////    @PostMapping("/register")
////    public ResponseEntity<?> register(@RequestBody UserRegistrationRequest registerRequest) {
////        if (registerUserRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
////            return ResponseEntity.badRequest().body("Email already exists");
////        }
////
////        String otp = otpService.generateOtp(registerRequest.getEmail());
////        emailService.sendOtp(registerRequest.getEmail(), otp);
////
////        return ResponseEntity.ok("OTP sent to your email.");
////    }
////
////    @PostMapping("/verify-otp")
////    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest otpRequest) {
////        if (otpService.validateOtp(otpRequest.getEmail(), otpRequest.getOtp())) {
////            RegisterUser registerUser =new RegisterUser();           
////            registerUser.setEmail(otpRequest.getEmail());
////            registerUser.setName(otpRequest.getName());
////            registerUser.setPassword(new BCryptPasswordEncoder().encode(otpRequest.getPassword()));
////            registerUser.setVerified(true);
////            registerUserRepository.save(registerUser);
////            return ResponseEntity.ok("User registered successfully");
////        } else {
////            return ResponseEntity.badRequest().body("Invalid OTP");
////        }
////    }
////
//////    @PostMapping("/login")
//////    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
//////    	Optional<User> registerUser = registerUserRepository.findByEmail(loginRequest.getEmail());
//////        if (registerUser.isPresent() && registerUser.get().isVerified()) {
//////            String token = jwtUtil.generateToken(registerUser.get());
//////            return ResponseEntity.ok(new JwtResponse(token));
//////        } else {
//////            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid credentials or user not verified");
//////        }
////    
////    @PostMapping("/login")
////    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
////        String token = userService.loginUser(loginRequest);
////        return ResponseEntity.ok(token);
////    }
////    }
////
//
//
//package com.hachionUserDashboard.controller;
//
//import java.util.Optional;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.authentication.AuthenticationManager;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.hachionUserDashboard.dto.LoginRequest;
//import com.hachionUserDashboard.dto.OtpRequest;
//import com.hachionUserDashboard.dto.UserRegistrationRequest;
//import com.hachionUserDashboard.entity.RegisterUser;
//import com.hachionUserDashboard.entity.User;
//import com.hachionUserDashboard.repository.RegisterUserRepository;
//import com.hachionUserDashboard.repository.UserRepository;
//import com.hachionUserDashboard.service.EmailService;
//import com.hachionUserDashboard.service.OtpService;
//import com.hachionUserDashboard.service.UserService;
//import com.hachionUserDashboard.util.JwtUtil;
//import com.nimbusds.oauth2.sdk.TokenRequest;
//
//@RestController
//@RequestMapping("/auth")
//public class AuthController {
//
//    @Autowired
//    private UserRepository userRepository;
//    
//    @Autowired
//    private RegisterUserRepository registerUserRepository;
//    
//    @Autowired
//    private UserService userService;
//
//    @Autowired
//    private OtpService otpService;
//
//    @Autowired
//    private EmailService emailService;
//    
//    @Autowired
//    private AuthenticationManager authenticationManager;
//    @Autowired
//    private JwtUtil jwtUtil;
//    
//
//    
////    @PostMapping("/google")
////    public ResponseEntity<?> googleLogin(@RequestBody TokenRequest tokenRequest) {
////        // Verify token with Google API and create JWT if valid
////        //String googleToken = tokenRequest.getToken();
////        // Implement Google verification logic here
////        return ResponseEntity.ok("Google login success");
////    }
////
////    @PostMapping("/facebook")
////    public ResponseEntity<?> facebookLogin(@RequestBody TokenRequest tokenRequest) {
////        // Verify token with Facebook API and create JWT if valid
////        //String facebookToken = tokenRequest.getToken();
////        // Implement Facebook verification logic here
////        return ResponseEntity.ok("Facebook login success");
////    }
//
//
//    @PostMapping("/register")
//    public ResponseEntity<?> register(@RequestBody UserRegistrationRequest registerRequest) {
//        if (registerUserRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
//            return ResponseEntity.badRequest().body("Email already exists");
//        }
//
//        String otp = otpService.generateOtp(registerRequest.getEmail());
//        emailService.sendOtp(registerRequest.getEmail(), otp);
//
//        return ResponseEntity.ok("OTP sent to your email.");
//    }
//
////    @PostMapping("/verify-otp")
////    public ResponseEntity<?> verifyOtp(@RequestBody OtpRequest otpVerificationRequest) {
////        String email = otpVerificationRequest.getEmail();
////        String otp = otpVerificationRequest.getOtp();
////        String rawPassword = otpVerificationRequest.getPassword();
////
////        // Find user by email and check OTP
////        RegisterUser user = registerUserRepository.findByEmail(email)
////            .orElseThrow(() -> new RuntimeException("User not found"));
////
////        if (!otpService.isValidOtp(user, otp)) {
////            return ResponseEntity.badRequest().body("Invalid OTP");
////        }
////
////        // Check if password is provided
////        if (rawPassword == null || rawPassword.isEmpty()) {
////            return ResponseEntity.badRequest().body("Password cannot be null or empty");
////        }
////
////        BCryptPasswordEncoder passwordEncoder = null;
////		// Hash the password using BCrypt
////        String encodedPassword = passwordEncoder.encode(rawPassword);
////        user.setPassword(encodedPassword);
////        user.setVerified(true);
////
////        registerUserRepository.save(user);
////
////        return ResponseEntity.ok("OTP verified and password set successfully");
////    }
//
//
//
//    @PostMapping("/verify-otp")
//    public ResponseEntity<String> verifyOtp(@RequestBody OtpRequest otpRequest) {
//        String email = otpRequest.getEmail();
//        String otp = otpRequest.getOtp();
//
//        // Validate OTP
//        if (!otpService.validateOtp(email, otp)) {
//            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid OTP");
//        }
//
//        // Log for debugging purposes
//        System.out.println("OTP validated for email: " + email);
//
//        // Check if RegisterUser exists in RegisterUser table
//        Optional<RegisterUser> registerUserOpt = registerUserRepository.findByEmail(email);
//        if (!registerUserOpt.isPresent()) {
//            System.out.println("RegisterUser not found for email: " + email);
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found during verification");
//        }
//
//        RegisterUser registerUser = registerUserOpt.get();
//        System.out.println("RegisterUser found: " + registerUser.getEmail());
//
//        // Check if user already exists in User table
//        Optional<User> existingUserOpt = userService.findByEmail(email);
//        if (existingUserOpt.isPresent()) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).body("User already registered");
//        }
//
//        // Create a new User from RegisterUser details
//        User newUser = new User();
//        newUser.setEmail(registerUser.getEmail());
//        newUser.setUserName(registerUser.getName()); // Assuming the name is stored in RegisterUser
//        newUser.setPassword(encodePassword(otpRequest.getPassword())); // Ensure password is encrypted
//        newUser.setVerified(true); // Mark as verified
//
//        userService.saveUser(newUser); // Save new user
//
//        System.out.println("New user registered with email: " + email);
//
//        return ResponseEntity.ok("User registered successfully");
//    }
//
//	private String encodePassword(String password) {
//	// TODO Auto-generated method stub
//	return null;
//}
//
//	@PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
//    	Optional<RegisterUser> registerUser = registerUserRepository.findByEmail((String) loginRequest.getEmail());
//
//        
//        if (registerUser.isPresent() && registerUser.get().isVerified()) {
//            // Authenticate user
//            try {
//                authenticationManager.authenticate(
//                        new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
//                );
//            } catch (Exception ex) {
//                return ResponseEntity.badRequest().body("Invalid credentials");
//            }
//
//            // Generate JWT token
//            String token = jwtUtil.generateToken((String) loginRequest.getEmail());
//            return ResponseEntity.ok(token);
//        } else {
//            return ResponseEntity.badRequest().body("User not verified or credentials are invalid");
//        }
//    }
//}
