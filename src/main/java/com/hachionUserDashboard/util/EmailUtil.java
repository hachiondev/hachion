package com.hachionUserDashboard.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Component;

import com.hachionUserDashboard.dto.WorkshopRequest;
import com.hachionUserDashboard.entity.RequestBatch;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Component
public class EmailUtil {

    @Autowired
    private JavaMailSender javaMailSender;
    
    private final String ADMIN_EMAIL = "trainings@hachion.co";


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
    

    public void sendEmails(WorkshopRequest formRequest) throws MessagingException {
        sendToAdmin(formRequest);
        sendToUser(formRequest);
    }

    private void sendToAdmin(WorkshopRequest formRequest) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(ADMIN_EMAIL);
        helper.setSubject("New Registration - " + formRequest.getCourseName());
        helper.setText("New Registration Details:\n\n" +
                "Full Name: " + formRequest.getFullName() + "\n" +
                "Email: " + formRequest.getEmailId() + "\n" +
                "Mobile: " + formRequest.getMobileNumber() + "\n" +
                "Time Zone: " + formRequest.getTimeZone() + "\n" +
                "Course Name: " + formRequest.getCourseName());

        javaMailSender.send(message);
    }

    private void sendToUser(WorkshopRequest formRequest) throws MessagingException {
        MimeMessage message = javaMailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true);

        helper.setTo(formRequest.getEmailId());
        helper.setSubject("Registration Successful for " + formRequest.getCourseName());
        helper.setText("Dear " + formRequest.getFullName() + ",\n\n" +
                "You have successfully registered for the " + formRequest.getCourseName() + " training.\n\n" +
                "Thank you!");

        javaMailSender.send(message);
    }
    
}
