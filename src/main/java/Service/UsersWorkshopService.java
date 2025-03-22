package Service;

import java.util.List;

import com.hachionUserDashboard.dto.FormRequest;
import com.hachionUserDashboard.entity.UsersWorkshop;

import Response.UserWorkshopResponse;
import jakarta.mail.MessagingException;

public interface UsersWorkshopService {

	public UserWorkshopResponse userWorkshopRegistration(FormRequest formRequest) throws MessagingException;

	public List<UsersWorkshop> getAllUsers();
}