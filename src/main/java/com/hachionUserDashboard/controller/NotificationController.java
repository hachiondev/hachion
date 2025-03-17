////package com.hachionUserDashboard.controller;
////
////
////
////
////
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.security.authentication.AuthenticationManager;
////import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
////import org.springframework.web.bind.annotation.GetMapping;
////import org.springframework.web.bind.annotation.PostMapping;
////import org.springframework.web.bind.annotation.RequestBody;
////import org.springframework.web.bind.annotation.RestController;
////
////import com.hachionUserDashboard.entity.AuthRequest;
////import com.hachionUserDashboard.util.JwtUtil;
////
////
////
////@RestController
////public class WelcomeController {
////
////    @Autowired
////    private JwtUtil jwtUtil;
////
////    @Autowired
////    private AuthenticationManager authenticationManager;
////
////    @GetMapping("/")
////    public String welcome() {
////        return "Welcome to Spring Boot CRUD with JWT!";
////    }
////
////    @PostMapping("/authenticate")
////    public String generateToken(@RequestBody AuthRequest authRequest) throws Exception {
////        try {
////            authenticationManager.authenticate(
////                    new UsernamePasswordAuthenticationToken(authRequest.getUserName(), authRequest.getPassword())
////            );
////        } catch (Exception ex) {
////            throw new Exception("invalid username/password");
////        }
////        return jwtUtil.generateToken(authRequest.getUserName());
////    }
////
////    @GetMapping("/hello")
////    public String hello() {
////    	return "hello";
////   }
////}
////   
////
////
////
//
//
//
//package com.hachionUserDashboard.controller;
//
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//@RestController
//public class WelcomeController {
//
//    @GetMapping("/")
//    public String welcome() {
//        return "Welcome to Spring Boot CRUD with JWT!";
//    }
//
//    @GetMapping("/hello")
//    public String hello() {
//        return "Hello!";
//    }
//}
package com.hachionUserDashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.EmailDTO;


@RestController
public  class NotificationController{
	@Autowired
	private JavaMailSender javaMailSender;
	@PostMapping("/send-email")
	public String sendEmail(@RequestBody EmailDTO emailDto) {
		SimpleMailMessage simpleMailMessage=new SimpleMailMessage();
		simpleMailMessage.setTo(emailDto.getTo());
		simpleMailMessage.setSubject(emailDto.getSubject());
		simpleMailMessage.setText(emailDto.getText());
		javaMailSender.send(simpleMailMessage);
		
		return "Email sent successfully";
		
	}
	
}

