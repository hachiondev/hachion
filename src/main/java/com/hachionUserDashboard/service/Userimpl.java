
package com.hachionUserDashboard.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.Nullable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.CompletionDateResponse;
import com.hachionUserDashboard.dto.LoginRequest;
import com.hachionUserDashboard.dto.SocialLinksUpdateRequest;
import com.hachionUserDashboard.dto.SocialLinksUpdateResponse;
import com.hachionUserDashboard.dto.StudentInfoResponse;
import com.hachionUserDashboard.dto.UserProfileUpdateRequest;
import com.hachionUserDashboard.dto.UserProfileUpdateResponse;
import com.hachionUserDashboard.dto.UserRegistrationRequest;
import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.hachionUserDashboard.util.EmailUtil;
import com.hachionUserDashboard.util.OtpUtil;

import Response.LoginResponse;
import Response.UserProfileResponse;
import Service.UserService;
import jakarta.mail.MessagingException;
import java.nio.file.StandardCopyOption;

@Service
public class Userimpl implements UserService {

	@Autowired
	private RegisterStudentRepository userRepository;

	private OtpUtil otpUtil;
	@Autowired
	private EmailUtil emailUtil;

	@Autowired
	private EmailService emailService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private WebhookSenderService webhookSenderService;

	@Value("${user.profile.image.upload.dir}")
	private String uploadDir;
	private static final DateTimeFormatter OUT = DateTimeFormatter.ofPattern("dd-MM-yyyy");

	@Override
	public String sendOtp(String email) {
		RegisterStudent user = userRepository.findByEmail(email);
		if (user != null) {
			throw new IllegalArgumentException("This email already exists.");
		}

		String otp = otpUtil.generateOtp();

		user = new RegisterStudent();
		user.setEmail(email);
		user.setOTP(otp);
		user.setOTPStatus(false);

		userRepository.save(user);
		emailUtil.sendOtpEmail(email, otp);

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

	@Override
	public String registerApi(UserRegistrationRequest registrationRequest) throws MessagingException {

		RegisterStudent user = userRepository.findByEmail(registrationRequest.getEmail());

		if (user == null) {
			System.out.println("❌ Email does not exist in DB: " + registrationRequest.getEmail());
			return "Email does not exist.";
		}

		String hashedPassword = passwordEncoder.encode(registrationRequest.getPassword());
		System.out.println("🔹 Hashed password: " + hashedPassword);

		user.setFirstName(registrationRequest.getFirstName());
		user.setLastName(registrationRequest.getLastName());
		user.setUserName(registrationRequest.getFirstName() + " " + registrationRequest.getLastName());
		user.setPassword(hashedPassword);
		user.setMobile(registrationRequest.getMobile());
		user.setCountry(registrationRequest.getCountry());
		user.setStudentId(generateNextStudentId());
		user.setMode(registrationRequest.getMode());
		user.setDate(LocalDate.now());

		emailService.sendEmailForRegisterOnlineStudent(registrationRequest.getEmail(),
				registrationRequest.getFirstName());

		RegisterStudent save = userRepository.save(user);

		System.out.println("✅ User saved successfully in DB: " + save.getEmail());

		webhookSenderService.sendRegistrationDetailsOnline(save);

		return "User details updated successfully.";
	}

	@Override
	public String regenerateOtp(String email) {
		RegisterStudent user = userRepository.findByEmail(email);
		if (user == null) {
			throw new RuntimeException("Email not found.");
		}

		String newOtp = otpUtil.generateOtp();
		user.setOTP(newOtp);
		userRepository.save(user);
		emailUtil.sendOtpEmail(user.getEmail(), newOtp);

		return "OTP regenerated and sent successfully.";
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

	public RegisterStudent saveUser(String username, String email, String profileImage) {
		Optional<RegisterStudent> existingUser = getUserByEmail(email);
		if (existingUser.isPresent()) {
			return existingUser.get();
		}
		RegisterStudent newUser = new RegisterStudent();
		newUser.setUserName(username);
		newUser.setEmail(email);
		newUser.setOTPStatus(true);
		newUser.setStudentId(generateNextStudentId());
		newUser.setMode("Online");
		newUser.setStatus("signup");
		newUser.setProfileImage(profileImage);
		return userRepository.save(newUser);
	}

	public Optional<RegisterStudent> getUserForSignin(String email, String status) {
		return userRepository.findByEmailAndSignupStatus(email, status);
	}

	@Override
	public RegisterStudent signInWithGoogle(String email, String username) {

		RegisterStudent existing = userRepository.findBYEmailForOauth(email).orElseThrow(NoSuchElementException::new);

		existing.setUserName(username);

		return userRepository.save(existing);
	}

	public Optional<RegisterStudent> getUserByEmail(String email) {
		return userRepository.findBYEmailForOauth(email);
	}

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

//	public String regenerateOtp(String email) {
//		RegisterStudent user = userRepository.findByEmail(email);
//		if (user == null) {
//			throw new RuntimeException("Email not found.");
//		}
//
//		// Generate a new OTP
//		String newOtp = otpUtil.generateOtp();
//		user.setOTP(newOtp);
//
//		// Save the updated user with the new OTP
//		userRepository.save(user);
//
//		// Send the new OTP to the user's email
//		emailUtil.sendOtpEmail(user.getEmail(), newOtp);
//
//		return "OTP regenerated and sent successfully.";
//	}

//	public String forgotpassword(String email) {
//		RegisterStudent user = userRepository.findByEmail(email);
//
//		// Generate a random password
//		String randomPassword = generateRandomPassword();
//
//		// Hash the generated random password
//		String encodedPassword = passwordEncoder.encode(randomPassword);
//
//		// Update the user's password in the database
//		user.setPassword(encodedPassword);
//		userRepository.save(user);
//
//		// Send the random password to the user's email
////		emailUtil.sendSetPasswordEmail(email, randomPassword);
//
//		return "Please check your email to get your new password.";
//	}

	@Override
	public String forgotpassword(String email) {
		RegisterStudent user = userRepository.findByEmail(email);

		if (user == null) {
			return "User not found with this email.";
		}

		// Generate new OTP
		String otp = OtpUtil.generateOtp();

		// Update user with new OTP and reset OTP status
		user.setOTP(otp);
		user.setOTPStatus(false);
		userRepository.save(user);

		// Send OTP via email
		emailUtil.sendOtpEmail(email, otp);

		return "OTP sent to your email.";
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
			response.setGender(user.getGender());
			response.setAddress(user.getAddress());
			response.setBio(user.getBio());
			response.setLocation(user.getLocation());
			response.setTimeZone(user.getTime_zone());
//			response.setDob(user.getDob() != null ? user.getDob().format(OUT) : null);
			response.setDob(user.getDob()); // <-- no manual formatting, same type

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

//	@Transactional
//	public void resetPassword(UserRegistrationRequest request, MultipartFile profileImage) {
//		Optional<RegisterStudent> optionalUser = userRepository.findByEmailForProfile(request.getEmail());
//
//		if (optionalUser.isPresent()) {
//			RegisterStudent user = optionalUser.get();
//
//			if (request.getPassword() != null && !request.getPassword().isEmpty()) {
//				if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
//					System.out.println("Request Password: " + request.getPassword());
//					System.out.println("User Encoded Password: " + user.getPassword());
//					System.out.println("Password Match: " + passwordEncoder.matches(request.getPassword(), user.getPassword()));
//					String encoded = passwordEncoder.encode("Hach@123");
//					System.out.println("Encoded: " + encoded);
//					return;
//				}
//
//				if (request.getNewPassword() == null || request.getNewPassword().isEmpty()
//						|| request.getConfirmPassword() == null || request.getConfirmPassword().isEmpty()) {
//					System.out.println("New password and confirm password are required when changing password");
//					return;
//				}
//
//				if (!request.getNewPassword().equals(request.getConfirmPassword())) {
//					System.out.println("New password and confirm password do not match");
//					return;
//				}
//
//				if (passwordEncoder.matches(request.getNewPassword(), user.getPassword())) {
//					System.out.println("New password must be different from the old password");
//					return;
//				}
//
//				String encodedPassword = passwordEncoder.encode(request.getNewPassword());
//				user.setPassword(encodedPassword);
//				System.out.println("Password updated successfully");
//			}
//
//			if (request.getUserName() != null && !request.getUserName().isEmpty()) {
//				user.setUserName(request.getUserName());
//			}
//			if (request.getMobile() != null && !request.getMobile().isEmpty()) {
//				user.setMobile(request.getMobile());
//			}
//
//			if (profileImage != null && !profileImage.isEmpty()) {
//			    try {
//			        String originalFilename = profileImage.getOriginalFilename();
//			        String studentId = user.getStudentId();
//
//			        // Optional sanitization
//			        String sanitizedFilename = originalFilename.replaceAll("[^a-zA-Z0-9\\.\\-]", "_");
//			        String newFileName = studentId + "_" + sanitizedFilename;
//
//			        // Delete old image if it exists
//			        String oldFileName = user.getProfileImage();
//			        if (oldFileName != null && !oldFileName.isEmpty()) {
//			            Path oldFilePath = Paths.get(uploadDir, oldFileName);
//			            Files.deleteIfExists(oldFilePath);
//			        }
//
//			        // Save new image
//			        Path newFilePath = Paths.get(uploadDir, newFileName);
//			        Files.createDirectories(newFilePath.getParent());
//			        Files.write(newFilePath, profileImage.getBytes());
//
//			        user.setProfileImage(newFileName);
//
//			    } catch (IOException e) {
//			        System.out.println("Failed to save profile image: " + e.getMessage());
//			    }
//			}
//
//
//			userRepository.save(user);
//		} else {
//			System.out.println("User not found with email: " + request.getEmail());
//		}
//	}

//	@Transactional
//	public void resetPassword(UserRegistrationRequest request, MultipartFile profileImage) {
//		Optional<RegisterStudent> optionalUser = userRepository.findByEmailForProfile(request.getEmail());
//
//		if (optionalUser.isPresent()) {
//			RegisterStudent user = optionalUser.get();
//
//			if (request.getPassword() != null && !request.getPassword().isEmpty()) {
//				System.out.println("Password provided: " + request.getPassword()); // debug
//				String encodedPassword = passwordEncoder.encode(request.getPassword());
//				user.setPassword(encodedPassword);
//				System.out.println("Password updated successfully in DB: " + encodedPassword);
//			}
//
//			if (request.getUserName() != null && !request.getUserName().isEmpty()) {
//				user.setUserName(request.getUserName());
//			}
//			if (request.getMobile() != null && !request.getMobile().isEmpty()) {
//				user.setMobile(request.getMobile());
//			}
//
//			// profile image logic...
//			userRepository.save(user);
//		} else {
//			System.out.println("User not found with email: " + request.getEmail());
//		}
//	}
	@Transactional
	public void resetPassword(UserRegistrationRequest request, MultipartFile profileImage) {
		Optional<RegisterStudent> optionalUser = userRepository.findByEmailForProfile(request.getEmail());

		if (optionalUser.isPresent()) {
			RegisterStudent user = optionalUser.get();

			// 1) (optional but good) verify old password
			if (request.getPassword() != null && !request.getPassword().isEmpty()) {
				if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
					System.out.println("Old password is incorrect");
					return; // or throw an exception / return error response
				}
			}

			// 2) ✅ use newPassword to update
			if (request.getNewPassword() != null && !request.getNewPassword().isEmpty()) {
				String encodedPassword = passwordEncoder.encode(request.getNewPassword());
				user.setPassword(encodedPassword);
				System.out.println("New password updated successfully in DB: " + encodedPassword);
			}

			if (request.getUserName() != null && !request.getUserName().isEmpty()) {
				user.setUserName(request.getUserName());
			}
			if (request.getMobile() != null && !request.getMobile().isEmpty()) {
				user.setMobile(request.getMobile());
			}

			// profile image logic...
			userRepository.save(user);
		} else {
			System.out.println("User not found with email: " + request.getEmail());
		}
	}

	@Override
	public Optional<RegisterStudent> findByEmailForProfile(String email) {

		return userRepository.findByEmailForProfile(email);
	}

	@Transactional
	@Override
	public UserProfileUpdateResponse updateProfile(UserProfileUpdateRequest request,
			@Nullable MultipartFile profileImage) {

		if (request == null || request.getEmail() == null || request.getEmail().isBlank()) {
			throw new IllegalArgumentException("Email is required to update profile.");
		}

		RegisterStudent user = userRepository.findByEmail(request.getEmail());
		if (user == null) {
			throw new IllegalArgumentException("User not found for email: " + request.getEmail());
		}

		// 🚫 Do NOT update email or mobile
		if (request.getFirstName() != null)
			user.setFirstName(request.getFirstName().trim());
		if (request.getLastName() != null)
			user.setLastName(request.getLastName().trim());

		// auto-set username if missing
		if (request.getUserName() != null && !request.getUserName().isBlank()) {
			user.setUserName(request.getUserName().trim());
		} else {
			String fn = user.getFirstName() != null ? user.getFirstName() : "";
			String ln = user.getLastName() != null ? user.getLastName() : "";
			user.setUserName((fn + " " + ln).trim());
		}

		if (request.getDob() != null) { // field present (could be empty to clear)
			String dobStr = request.getDob().trim();
			if (dobStr.isEmpty()) {
				user.setDob(null); // <-- clear DOB
			} else {
				DateTimeFormatter fmt = DateTimeFormatter.ofPattern("dd-MM-yyyy");
				user.setDob(LocalDate.parse(dobStr, fmt));
			}
		}

		if (request.getGender() != null)
			user.setGender(request.getGender().trim());
		if (request.getLocation() != null)
			user.setLocation(request.getLocation().trim());
		if (request.getTimeZone() != null)
			user.setTime_zone(request.getTimeZone().trim());
		if (request.getAddress() != null)
			user.setAddress(request.getAddress().trim());
		if (request.getBio() != null)
			user.setBio(request.getBio().trim());

		// ----- Optional profile image -----
		if (profileImage != null && !profileImage.isEmpty()) {
			try {
				Path baseDir = Paths.get(uploadDir).toAbsolutePath().normalize();
				Files.createDirectories(baseDir);

				String studentId = (user.getStudentId() != null) ? user.getStudentId() : "USER";
				String original = profileImage.getOriginalFilename();
				String safeOriginal = (original == null ? "profile.png" : original).replaceAll("[^a-zA-Z0-9._-]", "_");

				String ext;
				int dot = safeOriginal.lastIndexOf('.');
				if (dot > 0 && dot < safeOriginal.length() - 1) {
					ext = safeOriginal.substring(dot); // includes dot
				} else {
					String ct = profileImage.getContentType();
					ext = (ct != null && ct.endsWith("jpeg")) ? ".jpg" : ".png";
				}

				String newFileName = studentId + "_" + System.currentTimeMillis() + ext;
				Path newFilePath = baseDir.resolve(newFileName);

				// delete old file (best-effort)
				String oldFile = user.getProfileImage();
				if (oldFile != null && !oldFile.isBlank()) {
					try {
						Files.deleteIfExists(baseDir.resolve(oldFile));
					} catch (IOException ignore) {
						/* best-effort */ }
				}

				// save new file
				Files.copy(profileImage.getInputStream(), newFilePath, StandardCopyOption.REPLACE_EXISTING);

				// update DB with filename
				user.setProfileImage(newFileName);

			} catch (IOException ioe) {
				throw new RuntimeException("Failed to save profile image", ioe);
			}
		}

		// Save everything (including image filename if changed)
		userRepository.save(user);

		// ----- Build response (after image handling) -----
		UserProfileUpdateResponse response = new UserProfileUpdateResponse();
		response.setMessage("✅ Profile updated successfully.");
		response.setEmail(user.getEmail());
		response.setFirstName(user.getFirstName());
		response.setLastName(user.getLastName());
		response.setUserName(user.getUserName());
		response.setDob(
				user.getDob() != null ? user.getDob().format(java.time.format.DateTimeFormatter.ofPattern("dd-MM-yyyy"))
						: null);
		response.setGender(user.getGender());
		response.setLocation(user.getLocation());
		response.setTimeZone(user.getTime_zone());
		response.setAddress(user.getAddress());
		response.setBio(user.getBio());

		if (user.getProfileImage() != null && !user.getProfileImage().isBlank()) {
			response.setProfileImageUrl("/api/v1/user/profile/" + user.getProfileImage());
		}

		return response;
	}

	@Transactional
	public SocialLinksUpdateResponse updateSocialLinksByEmail(String email, SocialLinksUpdateRequest request) {
	    Optional<RegisterStudent> optionalStudent = userRepository.getByEmail(email);
	    SocialLinksUpdateResponse response = new SocialLinksUpdateResponse();

	    if (optionalStudent.isPresent()) {
	        RegisterStudent student = optionalStudent.get();

	        if (request.getFacebook() != null) {
	            student.setFacebook(request.getFacebook());
	        }
	        if (request.getTwitter() != null) {
	            student.setTwitter(request.getTwitter());
	        }
	        if (request.getLinkedin() != null) {
	            student.setLinkedin(request.getLinkedin());
	        }
	        if (request.getWebsite() != null) {
	            student.setWebsite(request.getWebsite());
	        }
	        if (request.getGithub() != null) {
	            student.setGithub(request.getGithub());
	        }

	        userRepository.updateSocialLinksByEmailQuery(
	                email,
	                student.getFacebook(),
	                student.getTwitter(),
	                student.getLinkedin(),
	                student.getWebsite(),
	                student.getGithub()
	        );

	        response.setFacebook(student.getFacebook());
	        response.setTwitter(student.getTwitter());
	        response.setLinkedin(student.getLinkedin());
	        response.setWebsite(student.getWebsite());
	        response.setGithub(student.getGithub());
	    }

	    return response;
	}

}
