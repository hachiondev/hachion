package Service;

import java.util.List;

import com.hachionUserDashboard.dto.LoginRequest;
import com.hachionUserDashboard.dto.UserRegistrationRequest;
import com.hachionUserDashboard.entity.User;
import com.hachionUserDashboard.repository.UserRepository;

import Response.LoginResponse;

public interface UserService {

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
	
	String updatePassword(UserRegistrationRequest registrationRequest);

	User saveUser(String username, String email);
//	Map<String, String> getUserInfo(String accessToken);

	public List<User> getAllRegisteredStudents();

}
