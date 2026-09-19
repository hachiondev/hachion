package com.hachionUserDashboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.AdminDTO;
import com.hachionUserDashboard.dto.LoginAdminDTO;
import com.hachionUserDashboard.entity.Admin;
import com.hachionUserDashboard.repository.AdminRepository;

import Response.LoginMessage;
import Service.AdminService;


@Service
public class Adminimpl implements AdminService{

@Autowired
private AdminRepository repo;

@Autowired
private PasswordEncoder passwordEncoder;


@Override
public String register(AdminDTO registerDto) {
    Admin admin = new Admin();
    admin.setUsername(registerDto.getUsername());
    admin.setEmail(registerDto.getEmail());

    // Hash the password before saving
    String encodedPassword = passwordEncoder.encode(registerDto.getPassword());
    admin.setPassword(encodedPassword);

    repo.save(admin);
    return "Admin registration successful";
}



	@Override
	public LoginMessage loginAdmin(LoginAdminDTO loginDto) {
	    Admin admin = repo.findByEmail(loginDto.getEmail()); // Fetch user by email

	    if (admin != null) { // Check if email exists
	        String encodedPassword = admin.getPassword();

	        // Validate password
	        if (passwordEncoder.matches(loginDto.getPassword(), encodedPassword)) {
	            // Password matches, return success
	            return new LoginMessage("Login successful", true, admin.getUsername(), null);
	        } else {
	            // Password does not match
	            return new LoginMessage("Invalid password", false, null, null);
	        }
	    } else {
	        // Email not found
	        return new LoginMessage("Email does not exist", false, null, null);
	    }
	}



	@Override
	public String getUserById(Long id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public String addAdmin(AdminDTO adminDTO) {
		// TODO Auto-generated method stub
		return null;
	}


	@Override
	public Object login(LoginAdminDTO loginDto) {
		// TODO Auto-generated method stub
		return null;
	}

	
}
