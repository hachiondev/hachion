//package com.hachionUserDashboard.service;
//
//import java.util.HashMap;
//import java.util.Map;
//import java.util.Random;
//
//import org.springframework.stereotype.Service;
//
//import com.hachionUserDashboard.entity.RegisterUser;
//
//@Service
//public class OtpService {
//	
//	
//	private final Map<String, String> otpCache = new HashMap<>();
//
//    public String generateOtp(String email) {
//        String otp = String.format("%06d", new Random().nextInt(1000000)); // Ensure 6 digits
//        otpCache.put(email, otp);
//        return otp;
//    }
//
//    public boolean validateOtp(String email, String otp) {
//        return otp.equals(otpCache.get(email));
//    }
//
////	public boolean isValidOtp(RegisterUser user, String otp) {
////		// TODO Auto-generated method stub
////		return false;
////	}
////}
//package com.hachionUserDashboard.service;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//import java.util.Random;
//
//@Service
//public class OtpService {
//
//    @Autowired
//    private JavaMailSender mailSender;
//
//    // Generate a random 6-digit OTP
//    public String generateOtp() {
//        Random random = new Random();
//        int otp = 1000 + random.nextInt(9000);
//        return String.valueOf(otp);
//    }
//
//    // Send OTP to email
//    public void sendOtpToEmail(String email, String otp) {
//        SimpleMailMessage message = new SimpleMailMessage();
//        message.setTo(email);
//        message.setSubject("Your OTP Code");
//        message.setText("Your OTP is: " + otp);
//
//        mailSender.send(message);
//    }
//
//    // Combine generate and send
//    public String sendOtp(String email) {
//        String otp = generateOtp();
//        sendOtpToEmail(email, otp);
//        return otp; // Return OTP for further use
//    }
//}
