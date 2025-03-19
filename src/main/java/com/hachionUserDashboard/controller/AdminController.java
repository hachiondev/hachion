
//
//import java.util.HashMap;
//import java.util.Map;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import com.hachionUserDashboard.entity.Admin;
//import com.hachionUserDashboard.service.AdminService;
//
//
//@RestController
//@RequestMapping("api/admin")
//@CrossOrigin(origins = "http://localhost:3000")
//public class AdminController {
//
//    @Autowired
//    private AdminService adminService;
//    
//    
////    @GetMapping("/profile")
////    public ResponseEntity<Admin> getAdminProfile() {
////        Admin admin = adminService.getLoggedInAdmin(); // Fetch the logged-in admin's details
////        if (admin != null) {
////            return ResponseEntity.ok(admin);
////        } else {
////            return ResponseEntity.status(404).body(null);
////        }
////    }
//
//    @PostMapping("/logout")
//    public ResponseEntity<String> logoutAdmin() {
//        // Clear the session or authentication details if applicable
//        return ResponseEntity.ok("Logged out successfully");
//    }
//
//
//    @PostMapping("/login")
//    public ResponseEntity<Map<String, String>> login(@RequestBody Admin loginRequest) {
//        Admin admin = adminService.getAdminEmail(loginRequest.getEmail());
//
//        if (admin != null && admin.getPassword().equals(loginRequest.getPassword())) {
//            Map<String, String> response = new HashMap<>();
//            response.put("message", "Login Successful");
//            response.put("username", admin.getUsername()); // Assuming `username` is a field in Admin entity
//            
//            // Log the username to ensure it is being fetched correctly
//            System.out.println("Fetched Username from DB: " + admin.getUsername());
//
//            return ResponseEntity.ok(response);
//        } else {
//            return ResponseEntity.status(401).body(Map.of("message", "Invalid Email or Password"));
//        }
//    }
//
//
//    // Admin registration
//    @PostMapping("/register")
//    public ResponseEntity<String> registerAdmin(@RequestBody Admin admin) {
//        adminService.saveAdmin(admin);
//        return ResponseEntity.ok("Admin Registered Successfully");
//    }
//
//    // Forgot password
//    @PostMapping("/forgot-password")
//    public ResponseEntity<String> forgotPassword(@RequestBody String email) {
//        boolean isReset = adminService.resetPassword(email);
//
//        if (isReset) {
//            return ResponseEntity.ok("A new password has been sent to your email.");
//        } else {
//            return ResponseEntity.status(404).body("Email not found.");
//        }
//    }
//}
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.hachionUserDashboard.dto.AdminDTO;
//import com.hachionUserDashboard.dto.LoginAdminDTO;
//
//
//import Response.LoginMessage;
//import Service.AdminService;
//import io.swagger.v3.oas.annotations.parameters.RequestBody;
//
//@RestController
//@CrossOrigin
//@RequestMapping("/api/v1/user")
//public class AdminController{
//	@Autowired
//	private AdminService adminService;
//	
//	@PostMapping("/adminregister")
//	public String saveAdmin(@RequestBody AdminDTO adminDTO) {
//	    System.out.println("Received AdminDTO: " + adminDTO);
//	    String id = adminService.addAdmin(adminDTO);
//	    return id;
//	}
//	@PostMapping("/adminlogin")
//	public ResponseEntity<LoginMessage> loginAdmin(@RequestBody LoginAdminDTO loginAdminDTO) {
//	    LoginMessage loginMessage = adminService.loginAdmin(loginAdminDTO);
//	    return ResponseEntity.ok(loginMessage);
//	}
//}
package com.hachionUserDashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;

import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.AdminDTO;
import com.hachionUserDashboard.dto.LoginAdminDTO;

import Response.LoginMessage;
import Service.AdminService;




@RestController
@CrossOrigin
//@CrossOrigin(origins ="http://localhost:3000")
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"})
@RequestMapping("/api/v1/user")
public class AdminController {

//	@Value("${allowed.origin}")
//	private String allowedOrigin;
	
  @Autowired
  private AdminService adminService;

  @PostMapping("/adminregister")
  public ResponseEntity<String> register(@RequestBody AdminDTO adminDto) {
      String response = (String) adminService.register(adminDto);
      return new ResponseEntity<>(response, HttpStatus.OK);
  }


  @PostMapping("/adminlogin")
  public ResponseEntity<?> login(@RequestBody LoginAdminDTO loginDto) {
      LoginMessage response = adminService.loginAdmin(loginDto);

      if (response.getStatus()) {
          // Login success, return 200 OK
          return ResponseEntity.ok(response);
      } else {
          // Login failed, return 401 Unauthorized
          return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
      }
  }


}
