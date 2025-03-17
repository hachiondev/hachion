package com.hachionUserDashboard.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.RequestBody;

import com.hachionUserDashboard.entity.RequestBatch;
@Component
public class EmailUtil {
	@Autowired
	public JavaMailSender javaMailSender;
	
	public void sendOtpEmail(String email,String otp) {
		SimpleMailMessage simpleMailMessage=new SimpleMailMessage();
//		SimpleMailMessageHelper simpleMailMessageHelper= new SimpleMailMessageHelper(simpleMailMessage);
		simpleMailMessage.setTo(email);
		simpleMailMessage.setSubject("Verify OTP");
		simpleMailMessage.setText("Hello Your OTP is " +otp);
		javaMailSender.send(simpleMailMessage);
	}



	public void sendRequestEmail(@RequestBody RequestBatch requestBatchRequest) {
		SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
        simpleMailMessage.setTo(requestBatchRequest.getEmail());
        simpleMailMessage.setSubject("Hachion Batch Request Confirmation");

        String message = String.format(
            "Hello %s,\n\nThank you for submitting a batch request. Here are your details:\n\nBatch: %s\nSchedule: %s\n\nThank you,\nHachion Team",
            requestBatchRequest.getUserName(), requestBatchRequest.getSchedule_date(), requestBatchRequest.getTime_zone()
        );

        simpleMailMessage.setText(message);
        javaMailSender.send(simpleMailMessage);
    }

	public void sendSetPasswordEmail(String email, String newPassword) {
		SimpleMailMessage simpleMailMessage = new SimpleMailMessage();
	    simpleMailMessage.setTo(email);
	    simpleMailMessage.setSubject("Your New Password");

	    // Send the new password in the email body
	    simpleMailMessage.setText(String.format("""
	      
	         Your new password is: %s
	          Please log in using this password, and we recommend changing it after logging in.
	        
	    """, newPassword));

	    javaMailSender.send(simpleMailMessage);
		
	}



	}

