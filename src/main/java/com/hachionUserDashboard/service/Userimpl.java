
package com.hachionUserDashboard.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.CompletionDateResponse;
import com.hachionUserDashboard.dto.LoginRequest;
import com.hachionUserDashboard.dto.StudentInfoResponse;
import com.hachionUserDashboard.dto.UserRegistrationRequest;
import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.hachionUserDashboard.util.OtpUtil;

import Response.LoginResponse;
import Response.UserProfileResponse;
import Service.UserService;
import jakarta.mail.MessagingException;

@Service
public class Userimpl implements UserService {

	@Autowired
	private RegisterStudentRepository userRepository;

	private OtpUtil otpUtil;
//	@Autowired
//	private EmailUtil emailUtil;

//	@Autowired
//	private EmailService emailService;

	@Autowired
	private PasswordEncoder passwordEncoder;

//	@Autowired
//	private WebhookSenderService webhookSenderService;
	
	@Value("${user.profile.image.upload.dir}")
	private String uploadDir;

	@Override
	public String sendOtp(String email) {

		RegisterStudent user = userRepository.findByEmail(email);

		if (user != null) {
			throw new IllegalArgumentException("This email already exists.");
		}

		String otp = String.format("%04d", new Random().nextInt(10000));

		user = new RegisterStudent();
		user.setEmail(email);
		user.setOTPStatus(false);

		user.setOTP(otp);
		System.out.println(otp);
		user.setOTPStatus(false);

//		emailUtil.sendOtpEmail(email, otp);
		userRepository.save(user);
//		emailUtil.sendOtpEmail(email, otp);

		return "OTP sent to your email.";
	}

	@Override
	public String verifyOtp(String email, String otp) {
		RegisterStudent user = userRepository.findByEmail(email);

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

//	if (userRepository.existsByMobile(registrationRequest.getMobile())) {
//	throw new RuntimeException("Mobile number already exists in the system");
//}
	@Override
	public String updatePassword(UserRegistrationRequest registrationRequest) throws MessagingException {

		if (!registrationRequest.getPassword().equals(registrationRequest.getConfirmPassword())) {
			return "Password and Confirm Password do not match.";
		}
		RegisterStudent user = userRepository.findByEmail(registrationRequest.getEmail());
		if (user == null) {
			return "Email does not exist.";
		}

		String hashedPassword = passwordEncoder.encode(registrationRequest.getPassword());
		user.setFirstName(registrationRequest.getFirstName());
		user.setLastName(registrationRequest.getLastName());
		user.setUserName(registrationRequest.getFirstName() + " " + registrationRequest.getLastName());
		user.setPassword(hashedPassword);
		user.setMobile(registrationRequest.getMobile());
		user.setCountry(registrationRequest.getCountry());
		user.setStudentId(generateNextStudentId());
		user.setMode(registrationRequest.getMode());
		user.setDate(LocalDate.now());

//		emailService.sendEmailForRegisterOnlineStudent(registrationRequest.getEmail(),
//				registrationRequest.getFirstName());

		RegisterStudent save = userRepository.save(user);

		System.out.println("🔍 Debug values:");
		System.out.println("FirstName: " + registrationRequest.getFirstName());
		System.out.println("LastName: " + registrationRequest.getLastName());
		System.out.println("Mobile: " + registrationRequest.getMobile());
		System.out.println("Country: " + registrationRequest.getCountry());

//		webhookSenderService.sendRegistrationDetails(save);

		return "Password and user details updated successfully.";
	}

	private String generateNextStudentId() {
		String prefix = "HACH";
		String lastStudentId = userRepository.findTopByOrderByStudentIdDesc();

		int nextNumber = 1;

		if (lastStudentId != null && lastStudentId.startsWith(prefix)) {
			String numberPart = lastStudentId.substring(prefix.length());
			try {
				nextNumber = Integer.parseInt(numberPart) + 1;
			} catch (NumberFormatException e) {
				nextNumber = 1;
			}
		}

		return prefix + String.format("%03d", nextNumber);
	}

	@Override
	public String addUser(UserRegistrationRequest userDTO) {

		RegisterStudent user = new RegisterStudent();

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
	public RegisterStudent saveUser(String username, String email) {
		// Check if the user already exists
		Optional<RegisterStudent> existingUser = userRepository.findBYEmailForOauth(email);
		if (existingUser.isPresent()) {
			return existingUser.get();
		}

		// Create a new user without using builder
		RegisterStudent newUser = new RegisterStudent();
		newUser.setUserName(username);
		newUser.setEmail(email);
		newUser.setOTPStatus(true);

		return userRepository.save(newUser);
	}

	public Optional<RegisterStudent> getUserByEmail(String email) {
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
	public List<RegisterStudent> getAllRegisteredStudents() {
		return userRepository.findAll();
	}

	@Override
	public LoginResponse LoginUser(LoginRequest loginRequest) {
		String msg = "";
		String msg1 = "";
		RegisterStudent user1 = userRepository.findByEmail(loginRequest.getEmail());

		if (user1 != null) {
			String password = loginRequest.getPassword();
			String encodedPassword = user1.getPassword();
			String name = user1.getUserName();
			String email = user1.getEmail();
			String studentId = user1.getStudentId();

			Boolean isPwdRight = passwordEncoder.matches(password, encodedPassword);
			if (isPwdRight) {
				Optional<RegisterStudent> user = userRepository.findOneByEmailAndPassword(loginRequest.getEmail(),
						encodedPassword);
				if (user.isPresent()) {
					return new LoginResponse("Login success", true, name, email, studentId);
				} else {
					return new LoginResponse("Login Failed", false, name, email, studentId);
				}
			} else {
				return new LoginResponse("password must match", false, name, email, studentId);
			}
		} else {
			return new LoginResponse("email not exist", false, null, msg, msg1);
		}
	}

	@Autowired
	public void UserServiceImpl(RegisterStudentRepository userRepository) {
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
		RegisterStudent user = userRepository.findByEmail(email);
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
		RegisterStudent user = userRepository.findByEmail(email);
		if (user == null) {
			throw new RuntimeException("Email not found.");
		}

		// Generate a new OTP
		String newOtp = otpUtil.generateOtp();
		user.setOTP(newOtp);

		// Save the updated user with the new OTP
		userRepository.save(user);

		// Send the new OTP to the user's email
//		emailUtil.sendOtpEmail(user.getEmail(), newOtp);

		return "OTP regenerated and sent successfully.";
	}

	public String forgotpassword(String email) {
		RegisterStudent user = userRepository.findByEmail(email);

		// Generate a random password
		String randomPassword = generateRandomPassword();

		// Hash the generated random password
		String encodedPassword = passwordEncoder.encode(randomPassword);

		// Update the user's password in the database
		user.setPassword(encodedPassword);
		userRepository.save(user);

		// Send the random password to the user's email
//		emailUtil.sendSetPasswordEmail(email, randomPassword);

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
		RegisterStudent user = userRepository.findByEmail(email);
		user.setPassword(newPassword);
		userRepository.save(user);
		return "New Password set successfully login with new password";
	}

	public List<StudentInfoResponse> getStudentsByCourse(String courseName) {
		List<Object[]> results = userRepository.findUsersByCourseName(courseName);
		List<StudentInfoResponse> responseList = new ArrayList<>();

		for (Object[] row : results) {
			StudentInfoResponse res = new StudentInfoResponse();
			res.setUserName((String) row[0]);
			res.setStudentId((String) row[1]);
			res.setEmail((String) row[2]);
			responseList.add(res);
		}

		return responseList;
	}

	public StudentInfoResponse getStudentInfo(String studentId, String userName) {
		if (studentId != null) {
			List<Object[]> result = userRepository.findUserNameEmailByStudentId(studentId);
			if (!result.isEmpty()) {
				Object[] row = result.get(0); // Get the first row (assuming only one result)
				return new StudentInfoResponse((String) row[0], // userName
						studentId, (String) row[1] // email
				);
			} else {
				throw new RuntimeException("Student ID not found");
			}
		} else if (userName != null) {
			List<Object[]> result = userRepository.findStudentIdEmailByUserName(userName);
			if (!result.isEmpty()) {
				Object[] row = result.get(0); // Get the first row (assuming only one result)
				return new StudentInfoResponse(userName, (String) row[0], // studentId
						(String) row[1] // email
				);
			} else {
				throw new RuntimeException("User not found");
			}
		}
		throw new IllegalArgumentException("Provide either studentId or userName");
	}

	public CompletionDateResponse getCompletionDate(String courseName, String userName) {
		String date = userRepository.findCompletionDateByCourseAndUser(courseName, userName);
		if (date == null) {
			throw new RuntimeException("Completion date not found for given course and user");
		}
		return new CompletionDateResponse(date);
	}

	public UserProfileResponse getUserProfileByEmail(String email) {

		if (!userRepository.existsByEmail(email)) {
			throw new RuntimeException("Your not able to enroll for course, please contact our hachion support team");
		}
		Optional<RegisterStudent> userOpt = userRepository.findByEmailForProfile(email);

		if (userOpt.isPresent()) {
			RegisterStudent user = userOpt.get();

			UserProfileResponse response = new UserProfileResponse();
			response.setName(user.getUserName());
			response.setEmail(user.getEmail());
			response.setMobile(user.getMobile());
			response.setStudentId(user.getStudentId());
			response.setProfileImage(user.getProfileImage());

			return response;
		} else {
			throw new RuntimeException("User not found for email: " + email);
		}
	}

//	public void resetPassword(UserRegistrationRequest request) {
//		Optional<RegisterStudent> optionalUser = userRepository.findByEmailForProfile(request.getEmail());
//
//		if (optionalUser.isPresent()) {
//			RegisterStudent user = optionalUser.get();
//
//			if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
//				System.out.println("Old password is incorrect");
//				return;
//			}
//
//			if (!request.getNewPassword().equals(request.getConfirmPassword())) {
//				System.out.println("New password and confirm password do not match");
//				return;
//			}
//
//			if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
//				System.out.println("New password must be different from the old password");
//				return;
//			}
//
//			String encodedPassword = passwordEncoder.encode(request.getNewPassword());
//			user.setPassword(encodedPassword);
//			userRepository.save(user);
//			System.out.println("Password updated successfully");
//
//		} else {
//			System.out.println("User not found with email: " + request.getEmail());
//		}
//	}
	
	@Transactional
	public void resetPassword(UserRegistrationRequest request, MultipartFile profileImage) {
		Optional<RegisterStudent> optionalUser = userRepository.findByEmailForProfile(request.getEmail());

		if (optionalUser.isPresent()) {
			RegisterStudent user = optionalUser.get();

			if (request.getPassword() != null && !request.getPassword().isEmpty()) {
				if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
					System.out.println("Request Password: " + request.getPassword());
					System.out.println("User Encoded Password: " + user.getPassword());
					System.out.println("Password Match: " + passwordEncoder.matches(request.getPassword(), user.getPassword()));
					String encoded = passwordEncoder.encode("Hach@123");
					System.out.println("Encoded: " + encoded);
					return;
				}

				if (request.getNewPassword() == null || request.getNewPassword().isEmpty()
						|| request.getConfirmPassword() == null || request.getConfirmPassword().isEmpty()) {
					System.out.println("New password and confirm password are required when changing password");
					return;
				}

				if (!request.getNewPassword().equals(request.getConfirmPassword())) {
					System.out.println("New password and confirm password do not match");
					return;
				}

				if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
					System.out.println("New password must be different from the old password");
					return;
				}

				String encodedPassword = passwordEncoder.encode(request.getNewPassword());
				user.setPassword(encodedPassword);
				System.out.println("Password updated successfully");
			}

			if (request.getUserName() != null && !request.getUserName().isEmpty()) {
				user.setUserName(request.getUserName());
			}
			if (request.getMobile() != null && !request.getMobile().isEmpty()) {
				user.setMobile(request.getMobile());
			}

			if (profileImage != null && !profileImage.isEmpty()) {
			    try {
			        String originalFilename = profileImage.getOriginalFilename();
			        String studentId = user.getStudentId();

			        // Optional sanitization
			        String sanitizedFilename = originalFilename.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
			        String newFileName = studentId + "_" + sanitizedFilename;

			        // Delete old image if it exists
			        String oldFileName = user.getProfileImage();
			        if (oldFileName != null && !oldFileName.isEmpty()) {
			            Path oldFilePath = Paths.get(uploadDir, oldFileName);
			            Files.deleteIfExists(oldFilePath);
			        }

			        // Save new image
			        Path newFilePath = Paths.get(uploadDir, newFileName);
			        Files.createDirectories(newFilePath.getParent());
			        Files.write(newFilePath, profileImage.getBytes());

			        user.setProfileImage(newFileName);

			    } catch (IOException e) {
			        System.out.println("Failed to save profile image: " + e.getMessage());
			    }
			}


			userRepository.save(user);
		} else {
			System.out.println("User not found with email: " + request.getEmail());
		}
	}

}
