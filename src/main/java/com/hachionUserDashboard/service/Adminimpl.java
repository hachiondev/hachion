//package com.hachionUserDashboard.service;
//
//
//import java.util.Random;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//import com.hachionUserDashboard.entity.Admin;
//import com.hachionUserDashboard.repository.AdminRepository;
//
//
//@Service
//public class AdminService {
//
//    @Autowired
//    private AdminRepository adminRepository;
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    @Value("${spring.mail.username}")
//    private String fromEmail;
//
//    public Admin saveAdmin(Admin admin) {
//        return adminRepository.save(admin);
//    }
//
//    public Admin getAdminEmail(String email) {
//        return adminRepository.findByEmail(email);
//    }
//
//    public boolean resetPassword(String email) {
//        Admin admin = adminRepository.findByEmail(email);
//        if (admin == null) {
//            return false;
//        }
//
//        // Generate a random new password
//        String newPassword = generateRandomPassword();
//        admin.setPassword(newPassword);
//        adminRepository.save(admin);
//
//        // Send the new password to the user's email
//        sendPasswordResetEmail(email, newPassword);
//        return true;
//    }
//
//    private String generateRandomPassword() {
//        String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//        StringBuilder password = new StringBuilder();
//        Random random = new Random();
//
//        for (int i = 0; i < 8; i++) {
//            password.append(characters.charAt(random.nextInt(characters.length())));
//        }
//        return password.toString();
//    }
//
//    private void sendPasswordResetEmail(String toEmail, String newPassword) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setFrom(fromEmail);
//        message.setTo(toEmail);
//        message.setSubject("Your New Password");
//        message.setText("Your new password is: " + newPassword + "\nPlease login and change it as soon as possible.");
//        mailSender.send(message);
//    }
//}
package com.hachionUserDashboard.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.AdminDTO;
import com.hachionUserDashboard.dto.LoginAdminDTO;
import com.hachionUserDashboard.dto.UserRegistrationRequest;
import com.hachionUserDashboard.entity.Admin;
import com.hachionUserDashboard.entity.User;
import com.hachionUserDashboard.repository.AdminRepository;

import Response.LoginMessage;
import Response.LoginResponse;
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
