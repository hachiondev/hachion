package com.hachionUserDashboard.service;
////
////import org.springframework.beans.factory.annotation.Autowired;
////import org.springframework.mail.SimpleMailMessage;
////import org.springframework.mail.javamail.JavaMailSender;
////import org.springframework.stereotype.Service;
////
////@Service
////public class EmailService {
////
////    @Autowired
////    private JavaMailSender mailSender;
////
////    public void sendOtp(String toEmail, String otp) {
////        SimpleMailMessage message = new SimpleMailMessage();
////        message.setTo(toEmail);
////        message.setSubject("Your OTP Code");
////        message.setText("Your OTP is: " + otp);
////        mailSender.send(message);
////    }
////}
////
//package com.hachionUserDashboard.service;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.mail.SimpleMailMessage;
//import org.springframework.mail.javamail.JavaMailSender;
//import org.springframework.stereotype.Service;
//
//@Service
//
//public class EmailService {
//	@Autowired
//	public JavaMailSender javaMailSender;
//
//	public void sendOtpEmail(String email, String otp) {
//	    SimpleMailMessage message = new SimpleMailMessage();
//	    message.setTo(email);
//	    message.setSubject("OTP Verification");
//	    message.setText("Your OTP is: " + otp);
//	    javaMailSender.send(message);
//	
//}
//}

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        message.setFrom("hachion.trainings@gmail.com");

        mailSender.send(message);
    }
}
