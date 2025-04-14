package com.hachionUserDashboard.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.hachionUserDashboard.entity.Enroll;
import com.hachionUserDashboard.entity.Query;
import com.hachionUserDashboard.entity.RequestBatch;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailUtil {

    @Autowired
    private JavaMailSender javaMailSender;

	
//	public void sendOtpEmail(String email,String otp) {
//		SimpleMailMessage simpleMailMessage=new SimpleMailMessage();
////		SimpleMailMessageHelper simpleMailMessageHelper= new SimpleMailMessageHelper(simpleMailMessage);
//		simpleMailMessage.setTo(email);
//		simpleMailMessage.setSubject("Verify OTP");
//		simpleMailMessage.setText("Hello Your OTP is " +otp);
//		javaMailSender.send(simpleMailMessage);
//	}


    // Send OTP Email
    public void sendOtpEmail(String email, String otp) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("trainings@hachion.co");  // ✅ Important for GoDaddy SMTP
            helper.setTo(email);
            helper.setSubject("Verify OTP");
            helper.setText("<h3>Hello,</h3><p>Your OTP is: <b>" + otp + "</b></p>", true); // ✅ HTML for better visibility

            javaMailSender.send(message);
            System.out.println("OTP Email sent successfully!");

        } catch (MessagingException e) {
            e.printStackTrace();
            System.err.println("Error sending email: " + e.getMessage());
        }
    }

    // Send Request Batch Email
    public void sendRequestEmail(RequestBatch requestBatchRequest) {  // Removed @RequestBody
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(requestBatchRequest.getEmail());
        simpleMailMessage.setSubject("Hachion Batch Request Confirmation");

        String message = String.format(
            "Hello %s,\n\nThank you for submitting a batch request. Here are your details:\n\n"
            + "Batch: %s\nSchedule: %s\nTime Zone: %s\n\nThank you,\nHachion Team",
            requestBatchRequest.getUserName(),
            
            requestBatchRequest.getSchedule_date(),
            requestBatchRequest.getTime_zone()
        );

        simpleMailMessage.setText(message);
        javaMailSender.send(simpleMailMessage);
    }
    public void sendEnrollEmail(Enroll enrollRequest) {  // Removed @RequestBody
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(enrollRequest.getEmail());
        simpleMailMessage.setSubject("Hachion Enrollment Confirmation");

        String message = String.format(
            "Hello %s,\n\nThank you for submitting enrollment request. Here are your details:\n\n"
            + "Batch: %s\nSchedule: %s\nTime Zone: %s\n\nThank you,\nHachion Team",
            enrollRequest.getName(),
            
            enrollRequest.getEnroll_date(),
            enrollRequest.getTime()
        );

        simpleMailMessage.setText(message);
        javaMailSender.send(simpleMailMessage);
    }

    // Send Set Password Email
    public void sendSetPasswordEmail(String email, String newPassword) {
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(email);
        simpleMailMessage.setSubject("Your New Password");

        String message = String.format(
            "Hello,\n\nYour new password is: %s\n\nPlease log in using this password. "
            + "We recommend changing it immediately after logging in.\n\nBest regards,\nHachion Team",
            newPassword
        );

        simpleMailMessage.setText(message);
        javaMailSender.send(simpleMailMessage);
    }
    public void sendQueryEmail(Query queryRequest) {  // Removed @RequestBody
        SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(queryRequest.getEmail());
        simpleMailMessage.setSubject("Hachion Query Session");

        String message = String.format(
            "Hello %s,\n\nThank you for submitting your query. One of our team member will call you shortly\n\n"
            + " %s\n\nThank you,\nHachion Team",
            queryRequest.getName(),
            queryRequest.getEmail(),
            queryRequest.getMobile()
        );

        simpleMailMessage.setText(message);
        javaMailSender.send(simpleMailMessage);
    }
  
}
