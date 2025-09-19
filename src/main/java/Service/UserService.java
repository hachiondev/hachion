package Service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.CompletionDateResponse;
import com.hachionUserDashboard.dto.LoginRequest;
import com.hachionUserDashboard.dto.StudentInfoResponse;
import com.hachionUserDashboard.dto.UserRegistrationRequest;
import com.hachionUserDashboard.entity.RegisterStudent;

import Response.LoginResponse;
import Response.UserProfileResponse;
import jakarta.mail.MessagingException;

public interface UserService {

//	String addUser(UserRegistrationRequest userDTO);
//
//	LoginResponse LoginUser(LoginRequest loginrequest);
//
//	String regenerateOtp(String email);
//
//	public static String verifyAccount(String email, String otp) {
//		// TODO Auto-generated method stub
//		return null;
//	}
//
//	String forgotpassword(String email);
//
//	String saveOtp(String email);
//
//	String sendOtp(String email);
//
//	String verifyAndRegisterUser(UserRegistrationRequest userDTO);
//
//	String addUser(UserRegistrationRequest userDTO, String otp);
//
//	Object register(UserRegistrationRequest registerDto);
//
//	Object setpassword(String email, String newPassword);
//
//	String verifyOtp(String email, String otp);
//
//	String updatePassword(UserRegistrationRequest registrationRequest);
//
//	User saveUser(String username, String email);
////	Map<String, String> getUserInfo(String accessToken);
//
//	public List<User> getAllRegisteredStudents();
//
//	List<StudentInfoResponse> getStudentsByCourse(String courseName);
//
//	public StudentInfoResponse getStudentInfo(String studentId, String userName);
//
//	public CompletionDateResponse getCompletionDate(String courseName, String userName);
//	public UserProfileResponse getUserProfileByEmail(String email);
//	
//	public void resetPassword(UserRegistrationRequest request);

	String addUser(UserRegistrationRequest userDTO);

	LoginResponse LoginUser(LoginRequest loginrequest);

	String regenerateOtp(String email);

	public static String verifyAccount(String email, String otp) {
		// TODO Auto-generated method stub
		return null;
	}

	String forgotpassword(String email);

	String saveOtp(String email);

	String sendOtp(String email);

	String verifyAndRegisterUser(UserRegistrationRequest userDTO);

	String addUser(UserRegistrationRequest userDTO, String otp);

	Object register(UserRegistrationRequest registerDto);

	Object setpassword(String email, String newPassword);

	String verifyOtp(String email, String otp);

	String registerApi(UserRegistrationRequest registrationRequest) throws MessagingException;

	RegisterStudent saveUser(String username, String email, String profileImage);
//	Map<String, String> getUserInfo(String accessToken);

	public List<RegisterStudent> getAllRegisteredStudents();

	List<StudentInfoResponse> getStudentsByCourse(String courseName);

	public StudentInfoResponse getStudentInfo(String studentId, String userName);

	public CompletionDateResponse getCompletionDate(String courseName, String userName);

	public UserProfileResponse getUserProfileByEmail(String email);

	public void resetPassword(UserRegistrationRequest request, MultipartFile profileImage);

	public RegisterStudent signInWithGoogle(String email, String username);

	public Optional<RegisterStudent> getUserForSignin(String email, String status);

	public Optional<RegisterStudent> findByEmailForProfile(String email);
}
