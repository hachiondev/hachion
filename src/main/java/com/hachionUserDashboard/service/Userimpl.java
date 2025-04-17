//
//package com.hachionUserDashboard.service;
//
//import com.hachionUserDashboard.dto.LoginRequest;
//import com.hachionUserDashboard.dto.UserRegistrationRequest;
//import com.hachionUserDashboard.entity.RegisterUser;
//import com.hachionUserDashboard.entity.User;
//import com.hachionUserDashboard.repository.RegisterUserRepository;
//import com.hachionUserDashboard.repository.UserRepository;
//import com.hachionUserDashboard.util.JwtUtil;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.security.crypto.password.PasswordEncoder;
//import org.springframework.stereotype.Service;
//
//import java.util.Optional;
//
//@Service
//public class UserService {
//
//    @Autowired
//    private UserRepository userRepository;
//    
//    public Optional<User> findByEmail(String email) {
//        return userRepository.findByEmail(email);
//    }
//
//    public void saveUser(User user) {
//        userRepository.save(user);
//    }
//
//    @Autowired
//    private RegisterUserRepository registerUserRepository;
//
//    @Autowired
//    private OtpService otpService;
//
//    @Autowired
//    private JwtUtil jwtUtil;
//
//    @Autowired
//    private PasswordEncoder passwordEncoder;
//
//    public void registerUserWithOTP(UserRegistrationRequest request) {
//        RegisterUser registerUser = new RegisterUser();
//        registerUser.setEmail(request.getEmail());
//        registerUser.setName(request.getName());
//        registerUser.setVerified(false);  // Set verified as false until OTP verification
//
//        try {
//            registerUserRepository.save(registerUser);
//            System.out.println("RegisterUser saved: " + registerUser);
//        } catch (Exception e) {
//            System.err.println("Error saving RegisterUser: " + e.getMessage());
//        }
//
//        // Send OTP
//        otpService.generateOtp(request.getEmail());
//    }
//
//
//    // Verify OTP and complete registration
//    public void verifyOtpAndCompleteRegistration(String email, String otp, String password) {
//        if (otpService.validateOtp(email, otp)) {
//            // Retrieve the user from the RegisterUser table
//            Optional<RegisterUser> optionalRegisterUser = registerUserRepository.findByEmail(email);
//            if (optionalRegisterUser.isPresent()) {
//                RegisterUser registerUser = optionalRegisterUser.get();
//
//                // Transfer to User table (finalize registration)
//                User user = new User();
//                user.setUserName(registerUser.getName());
//                user.setEmail(registerUser.getEmail());
//                user.setPassword(passwordEncoder.encode(password));  // Encrypt the password
//
//                // Save in the User table
//                userRepository.save(user);
//
//                // Mark user as verified
//                registerUser.setVerified(true);
//                registerUserRepository.save(registerUser);
//            } else {
//                throw new RuntimeException("User not found for email: " + email);
//            }
//        } else {
//            throw new RuntimeException("Invalid OTP");
//        }
//    }
//
//    // Social login registration
//    public void registerSocialUser(UserRegistrationRequest request) {
//        RegisterUser registerUser = new RegisterUser();
//        registerUser.setEmail(request.getEmail());
//        registerUser.setName(request.getName());
//        registerUser.setSocialId(request.getSocialId());
//        registerUser.setVerified(true);  // No OTP required for social login
//        registerUserRepository.save(registerUser);
//    }
//
//    // Login method with JWT token generation
//    public String loginUser(LoginRequest loginRequest) {
//        // Retrieve user from the User table by email (or username)
//        Optional<User> optionalUser = userRepository.findByEmail(loginRequest.getEmail());
//
//        if (optionalUser.isPresent()) {
//            User user = optionalUser.get();
//
//            // Validate the password
//            if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
//                // Generate JWT token
//                return jwtUtil.generateToken(user.getUserName());
//            } else {
//                throw new RuntimeException("Invalid credentials");
//            }
//        } else {
//            throw new RuntimeException("User not found");
//        }
//    }
//}

package com.hachionUserDashboard.service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hachionUserDashboard.dto.LoginRequest;
import com.hachionUserDashboard.dto.UserRegistrationRequest;
import com.hachionUserDashboard.entity.User;
import com.hachionUserDashboard.repository.UserRepository;
import com.hachionUserDashboard.util.EmailUtil;
import com.hachionUserDashboard.util.OtpUtil;

import Response.LoginResponse;
import Service.UserService;

@Service
public class Userimpl implements UserService {

	@Autowired
	private UserRepository userRepository;

	private OtpUtil otpUtil;
	@Autowired
	private EmailUtil emailUtil;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public String sendOtp(String email) {

		String otp = String.valueOf(new Random().nextInt(9999));

		User user = userRepository.findByEmail(email);

		if (user == null) {
			user = new User();
			user.setEmail(email);
			user.setOTPStatus(false);
		}

		user.setOTP(otp);
		user.setOTPStatus(false);

		userRepository.save(user);
		emailUtil.sendOtpEmail(email, otp);

		return "OTP sent to your email.";
	}

	@Override
	public String verifyOtp(String email, String otp) {
	    User user = userRepository.findByEmail(email);

	    if (user == null) {
	        return "Email does not exist in the database.";
	    }

	    if (user.getOTP().equals(otp)) {
	        
	        user.setOTPStatus(true);
	        user.setOTP(null); 
	        userRepository.save(user);

	        return "User verified successfully with OTP.";
	    } else {
	        return "Invalid OTP.";
	    }
	}

	@Override
	public String updatePassword(UserRegistrationRequest registrationRequest) {

		if (!registrationRequest.getPassword().equals(registrationRequest.getConfirmPassword())) {
			return "Password and Confirm Password do not match.";
		}
		User user = userRepository.findByEmail(registrationRequest.getEmail());
		if (user == null) {
			return "Email does not exist.";
		}
		String hashedPassword = passwordEncoder.encode(registrationRequest.getPassword());
		
		user.setPassword(hashedPassword);
		user.setUserName(registrationRequest.getUserName());
		user.setMobile(registrationRequest.getMobile());
		userRepository.save(user);

		return "Password and user details updated successfully.";
	}

	@Override
	public String addUser(UserRegistrationRequest userDTO) {
	
		User user = new User();

		user.setUserName(userDTO.getUserName());
		user.setEmail(userDTO.getEmail());
		String hashedPassword = passwordEncoder.encode(userDTO.getPassword());
		user.setPassword(hashedPassword);
		user.setMobile(userDTO.getMobile());
		user.setOTP(userDTO.getOTP());
		user.setOtpGeneratedTime(LocalDateTime.now());
		
		userRepository.save(user);
		return user.getUserName();
	}
	
	@Override
	public User saveUser(String username, String email) {
	    // Check if the user already exists
	    Optional<User> existingUser = userRepository.findBYEmailForOauth(email);
	    if (existingUser.isPresent()) {
	        return existingUser.get();
	    }

	    // Create a new user without using builder
	    User newUser = new User();
	    newUser.setUserName(username);
	    newUser.setEmail(email);
	    newUser.setOTPStatus(true);

	    return userRepository.save(newUser);
	}

	    public Optional<User> getUserByEmail(String email) {
	        return userRepository.findBYEmailForOauth(email);
	    }
	    
//	    @Override
//	    public void saveUser(String email, String username) {
//	        Optional<User> existingUser = userRepository.findBYEmailForOauth(email);
//	        if (existingUser.isEmpty()) {
//	            User newUser = new User();
//	            newUser.setEmail(email);
//	            newUser.setUserName(username);
//	            userRepository.save(newUser);
//	        }
//	    }

//	    public Map<String, String> getUserInfo(String accessToken) {
//	        RestTemplate restTemplate = new RestTemplate();
//	        String userInfoEndpoint = "https://www.googleapis.com/oauth2/v3/userinfo";
//	        
//	        HttpHeaders headers = new HttpHeaders();
//	        headers.setBearerAuth(accessToken);
//	        
//	        HttpEntity<String> entity = new HttpEntity<>(headers);
//	        ResponseEntity<Map> response = restTemplate.exchange(userInfoEndpoint, HttpMethod.GET, entity, Map.class);
//	        
//	        if (response.getStatusCode() == HttpStatus.OK) {
//	            Map<String, String> userInfo = response.getBody();
//	            if (userInfo != null) {
//	                saveUser(userInfo.get("email"), userInfo.get("name"));
//	            }
//	            return userInfo;
//	        }
//	        return Collections.emptyMap();
//	    }

	// public String addUser(UserRegistrationRequest userDTO) {
//    	String otp= otpUtil.generateOtp();
//   	emailUtil.sendOtpEmail(userDTO.getEmail(), otp);
//   	User user = new User(
//               null, userDTO.getName(),userDTO.getEmail(),
//                passwordEncoder.encode(userDTO.getPassword())
//      );
//        User user=new User();
//        user.setUserName(userDTO.getName());
//        user.setEmail(userDTO.getEmail());
//        String hashedPassword = passwordEncoder.encode(userDTO.getPassword());
//        user.setPassword(hashedPassword);
//        user.setOTP(otp);
//        user.setOtpgeneratedTime(LocalDateTime.now());
//       userRepository.save(user);
//       return user.getUserName(); // Ensure `getUsername` is defined in your `User` entity.
// }
//    
	    public List<User> getAllRegisteredStudents() {
	        return userRepository.findAll(); // This is correct
	    }
	@Override
	public LoginResponse LoginUser(LoginRequest loginRequest) {
		String msg = "";
		User user1 = userRepository.findByEmail(loginRequest.getEmail());

		if (user1 != null) { // Check if email exists
			String password = loginRequest.getPassword();
			String encodedPassword = user1.getPassword();
			String name = user1.getUserName();
			String email = user1.getEmail();

			Boolean isPwdRight = passwordEncoder.matches(password, encodedPassword);
			if (isPwdRight) {
				Optional<User> user = userRepository.findOneByEmailAndPassword(loginRequest.getEmail(),
						encodedPassword);
				if (user.isPresent()) {
					return new LoginResponse("Login success", true, name, email);
				} else {
					return new LoginResponse("Login Failed", false, name, email);
				}
			} else {
				return new LoginResponse("password must match", false, name, email);
			}
		} else {
			return new LoginResponse("email not exist", false, null, msg);
		}
	}

	@Autowired
	public void UserServiceImpl(UserRepository userRepository) {
		this.userRepository = userRepository;
	}
//public String login(LoginRequest loginDto) {
//    User user = UserRepository.findByEmail(loginDto.getEmail());
//    if (!loginDto.getPassword().equals(user.getPassword())) {
//      return "Password is incorrect";
//    } else if (!user.isActive()) {
//      return "your account is not verified";
//    }
//    return "Login successful";
//  }
//

//@Override
//public ResponseEntity<?> login(LoginRequest loginrequest) {
//    System.out.println("Login request received for email: " + loginrequest.getEmail());
//
//    // Fetch user by email
//    Optional<User> optionalUser = UserRepository.findOneByEmail(loginrequest.getEmail());
//    System.out.println("User fetched from database: " + optionalUser);
//
//    // Check if optionalUser is null
//    if (optionalUser == null) {
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//            .body(new LoginResponse("An unexpected error occurred", false));
//    }
//
//    if (optionalUser.isPresent()) {
//        User user = optionalUser.get(); // Extract the User object
//        String providedPassword = loginrequest.getPassword();
//        String storedPassword = user.getPassword();
//
//        System.out.println("Password provided: " + providedPassword);
//        System.out.println("Password stored: " + storedPassword);
//
//        // Compare passwords
//        BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//        if (passwordEncoder.matches(providedPassword, storedPassword)) {
//            // Successful login
//            return ResponseEntity.ok(new LoginResponse("Login Success", true));
//        } else {
//            // Incorrect password
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                .body(new LoginResponse("Password does not match", false));
//        }
//    } else {
//        // Email not found
//        return ResponseEntity.status(HttpStatus.NOT_FOUND)
//            .body(new LoginResponse("Email does not exist", false));
//    }
//}

	public String verifyAccount(String email, String otp) {
		User user = userRepository.findByEmail(email);
		if (user == null) {
			throw new RuntimeException("User not found with this email: " + email);
		}

		if (user.getOTP().equals(otp)
				&& Duration.between(user.getOtpgeneratedTime(), LocalDateTime.now()).getSeconds() < (3 * 60)) {

			user.setActive(true);
			userRepository.save(user);
			return "OTP verified successfully";
		}
		return "Please regenerate OTP and try again";
	}

	public String regenerateOtp(String email) {
		User user = userRepository.findByEmail(email);
		if (user == null) {
			throw new RuntimeException("Email not found.");
		}

		// Generate a new OTP
		String newOtp = otpUtil.generateOtp();
		user.setOTP(newOtp);

		// Save the updated user with the new OTP
		userRepository.save(user);

		// Send the new OTP to the user's email
		emailUtil.sendOtpEmail(user.getEmail(), newOtp);

		return "OTP regenerated and sent successfully.";
	}

	public String forgotpassword(String email) {
		User user = userRepository.findByEmail(email);

		// Generate a random password
		String randomPassword = generateRandomPassword();

		// Hash the generated random password
		String encodedPassword = passwordEncoder.encode(randomPassword);

		// Update the user's password in the database
		user.setPassword(encodedPassword);
		userRepository.save(user);

		// Send the random password to the user's email
		emailUtil.sendSetPasswordEmail(email, randomPassword);

		return "Please check your email to get your new password.";
	}

	private String generateRandomPassword() {
		// Create a random password (e.g., 12 characters long, alphanumeric)
		String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_-+=<>?";
		SecureRandom random = new SecureRandom();
		StringBuilder password = new StringBuilder(12);

		for (int i = 0; i < 12; i++) {
			int randomIndex = random.nextInt(characters.length());
			password.append(characters.charAt(randomIndex));
		}

		return password.toString();
	}

	@Override
	public String saveOtp(String email) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String verifyAndRegisterUser(UserRegistrationRequest userDTO) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String addUser(UserRegistrationRequest userDTO, String otp) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Object register(UserRegistrationRequest registerDto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public Object setpassword(String email, String newPassword) {
		User user = userRepository.findByEmail(email);
		user.setPassword(newPassword);
		userRepository.save(user);
		return "New Password set successfully login with new password";
	}

}
