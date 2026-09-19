package Service;


import com.hachionUserDashboard.dto.AdminDTO;
import com.hachionUserDashboard.dto.LoginAdminDTO;

import Response.LoginMessage;

public interface AdminService {
	String getUserById(Long id);

	String addAdmin(AdminDTO adminDTO);

	LoginMessage loginAdmin(LoginAdminDTO loginadminDTO);

	Object register(AdminDTO adminDto);

	Object login(LoginAdminDTO loginDto);


}
