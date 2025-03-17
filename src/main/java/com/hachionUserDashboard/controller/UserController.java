//package com.hachionUserDashboard.controller;
//
//import java.util.Map;
//
//import org.springframework.security.core.annotation.AuthenticationPrincipal;
//import org.springframework.security.oauth2.core.user.OAuth2User;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController  // This ensures the class is a REST controller
//public class UserController {
//
//    // Endpoint to get the current OAuth2 user's information
//    @GetMapping("/user")
//    public Map<String, Object> getCurrentUser(@AuthenticationPrincipal OAuth2User oauth2User) {
//        if (oauth2User != null) {
//            // Return user attributes like name and email
//            return oauth2User.getAttributes();
//        } else {
//            // Handle the case when no user is authenticated (optional)
//            throw new RuntimeException("User is not authenticated");
//        }
//    }
//}
//

package com.hachionUserDashboard.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.LoginRequest;
import com.hachionUserDashboard.dto.UserRegistrationRequest;
import com.hachionUserDashboard.service.Userimpl;

import Response.LoginResponse;
import Service.UserService;
import jakarta.validation.Valid;

@CrossOrigin
@RestController
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"})
@RequestMapping("/api/v1/user")
public class UserController{
	
	 @Autowired
	    private UserService userService;

	    @PostMapping("/send-otp")
	    public ResponseEntity<String> sendOtp(@RequestParam String email) {
	        if (email == null || email.isEmpty()) {
	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email is required");
	        }

	        String response = userService.sendOtp(email);
	        return new ResponseEntity<>(response, HttpStatus.OK);
	    }
	    
@PostMapping("/register")
public String addUser(@RequestBody UserRegistrationRequest userDTO) {
	String Id= userService.addUser(userDTO);
	return Id;
}
//	    @PostMapping("/register")
//	    public ResponseEntity<?> addUser(@Valid @RequestBody UserRegistrationRequest userDTO) {
//	        if (userDTO.getPassword() == null || userDTO.getPassword().isEmpty()) {
//	            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//	                    .body(Map.of("error", "Password is required."));
//	        }
//	        
//	        String response = userService.addUser(userDTO);
//	        return ResponseEntity.ok(Map.of("message", response));
//	    }

//	    @PostMapping("/register")
//	    public ResponseEntity<?> addUser( UserRegistrationRequest userDTO) {
//	        // Check if OTP is provided
////	        if (userDTO.getPassword() == null || userDTO.getPassword().isEmpty()) {
////	            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Password is required.");
////	        }
//
//	        // Add the user to the database
//	        String response = userService.addUser(userDTO);
//	        return ResponseEntity.ok(Map.of("message", response));
//	    }

//	;
//	 @PostMapping("/save")
//	 public String saveUser(@RequestBody UserRegistrationRequest userDTO) 
//		{
//			String id= userService.addUser(userDTO);
//			return id;
//		}

//
//	 @PutMapping("/verify-account")
//	 public ResponseEntity<String> verifyAccount(
//	     @RequestParam String email,
//	     @RequestParam String otp,
//	     @RequestParam String password,
//	     @RequestParam String confirmPassword) {
//
//	     if (password == null || confirmPassword == null || otp == null || email == null) {
//	         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Please fill in all fields");
//	     }
//
//	     if (!password.equals(confirmPassword)) {
//	         return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Passwords do not match");
//	     }
//
//	     return new ResponseEntity<>(UserService.verifyAccount(email, otp), HttpStatus.OK);
//	 }

	  @PutMapping("/regenerate-otp")
	  public ResponseEntity<String> regenerateOtp(@RequestParam String email) {
	    return new ResponseEntity<>(userService.regenerateOtp(email), HttpStatus.OK);
	  }
//	  @PutMapping("/login")
//	  public ResponseEntity<String> login(@RequestBody LoginRequest loginDto) {
//	    return new ResponseEntity(userService.login(loginDto), HttpStatus.OK);
//	  }
//	  @PostMapping("/login")
//	  public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
//	      LoginResponse loginResponse = userService.LoginUser(loginRequest);
//
//	      if (loginResponse.getStatus()) {
//	          // Successful login, return HTTP 200
//	          return ResponseEntity.ok(loginResponse);
//	      } else {
//	          // Unsuccessful login, return HTTP 401 or 404 depending on the error
//	          if ("Password not match".equals(loginResponse.getMessage())) {
//	              return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(loginResponse);
//	          } else if ("Email not exists".equals(loginResponse.getMessage())) {
//	              return ResponseEntity.status(HttpStatus.NOT_FOUND).body(loginResponse);
//	          } else {
//	              return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(loginResponse);
//	          }
//	      }
//	  }
//		private ResponseEntity<?> ResponseEntity(LoginResponse loginUser) {
//	// TODO Auto-generated method stub
//	return null;
//}
	  @PostMapping("/login")
	  public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
	     LoginResponse loginResponse=userService.LoginUser(loginRequest);
         return ResponseEntity.ok(loginResponse);

	  }

	  @PutMapping("/forgotpassword")
	  public ResponseEntity<String> forgotpassword(@RequestParam String email) {
	      return new ResponseEntity<>(userService.forgotpassword(email), HttpStatus.OK);
	  }


		
		@PutMapping("/setpassword")
		public ResponseEntity<String> setpassword(@RequestParam String email, @RequestHeader String newPassword){
			return new ResponseEntity(userService.setpassword(email,newPassword),HttpStatus.OK);
		}
		
//
//	
//
//	@PutMapping("/verify-account")
//	public ResponseEntity<String> verifyAccount(@RequestParam String email, @RequestParam String otp) {
//	    String response = UserService.verifyAccount(email, otp);
//	    return new ResponseEntity<>(response, HttpStatus.OK);
//	}
//
//	@PutMapping("/regenerateotp")
//	public ResponseEntity<String> regenerateOtp(@RequestParam String email) {
//	    String response = userService.regenerateOtp(email);
//	    return new ResponseEntity<>(response, HttpStatus.OK);
//	}
//
//

//@PutMapping("/forgotpasswordd")
//public ResponseEntity<String> forgotpassword(@RequestParam String email){
//	return new ResponseEntity<>(userService.forgotpassword(email),HttpStatus.OK);
//}
}