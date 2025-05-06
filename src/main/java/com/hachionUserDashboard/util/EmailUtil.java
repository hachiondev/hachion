package com.hachionUserDashboard.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
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
	private String imageUploadPath;

	
//	public void sendOtpEmail(String email,String otp) {
//		SimpleMailMessage simpleMailMessage=new SimpleMailMessage();
////		SimpleMailMessageHelper simpleMailMessageHelper= new SimpleMailMessageHelper(simpleMailMessage);
//		simpleMailMessage.setTo(email);
//		simpleMailMessage.setSubject("Verify OTP");
//		simpleMailMessage.setText("Hello Your OTP is " +otp);
//		javaMailSender.send(simpleMailMessage);
//	}


    // Send OTP Email
//    public void sendOtpEmail(String email, String otp) {
//        try {
//            MimeMessage message = javaMailSender.createMimeMessage();
//            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
//
//            helper.setFrom("trainings@hachion.co");  // ✅ Important for GoDaddy SMTP
//            helper.setTo(email);
//            helper.setSubject("Verify OTP");
//            helper.setText("<h3>Hello,</h3><p>Your OTP is: <b>" + otp + "</b></p>", true); // ✅ HTML for better visibility
//
//            javaMailSender.send(message);
//            System.out.println("OTP Email sent successfully!");
//
//        } catch (MessagingException e) {
//            e.printStackTrace();
//            System.err.println("Error sending email: " + e.getMessage());
//        }
//    }
    public void sendOtpEmail(String email, String otp) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("trainings@hachion.co");
            helper.setTo(email);
            helper.setSubject("Your One-Time Password (OTP) to Access Your Account");

            String htmlContent = "<div style='max-width: 600px; margin: auto; font-family: Arial, sans-serif;'>" +
                    "    <div style='text-align: center; padding: 10px 0;'>" +
                    "        <img src='cid:logoImage' alt='Logo' height='40'/>" +
                    "    </div>" +
                    "    <div style='background-color: #0056b3; color: white; text-align: center; padding: 15px; font-size: 18px; font-weight: bold;'>" +
                    "        Your One-Time Password (OTP) to Access Your Account" +
                    "    </div>" +
                    "    <div style='padding: 30px 20px;'>" +
                    "        <p>Hi Candidate,</p>" +
                    "        <p>We received a request to log in to your account on Hachion. Please use the One-Time Password (OTP) below to complete your login:</p>" +
                    "        <div style='font-size: 36px; font-weight: bold; text-align: center; margin: 20px 0;'>" + otp + "</div>" +
                    "        <hr/>" +
                    "        <p><strong>Note:</strong> In case of any technical difficulty do drop us a mail at <a href='mailto:trainings@hachion.co'>trainings@hachion.co</a></p>" +
                    "        <p>Regards,<br/>Team Hachion</p>" +
                    "    </div>" +
                    "</div>";

            helper.setText(htmlContent, true);

            ClassPathResource logoImage = new ClassPathResource("images/logo.png");
            helper.addInline("logoImage", logoImage);



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
    public void sendEnrollEmail(Enroll enrollRequest) {
        try {
            MimeMessage mimeMessage = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(enrollRequest.getEmail());
            helper.setSubject("Hachion Enrollment Confirmation");

            String htmlContent = """
            	    <html>
            	    <body style="font-family: Arial, sans-serif; text-align: center;">
            	        <img src='cid:logoImage' alt='Logo' style='height:40px;margin-bottom:20px;' />
            	        <img src='cid:bannerImage' alt='Live Demo' style='max-width: 100%%; height: auto;'/>
            	        <h2 style="color: #333;">Hi %s,</h2>
            	        <p>Thank you for showing interest in our training program by clicking <b>Enroll Now!</b></p>
            	        <p>We're excited to invite you to a <b>Free Demo Session</b> where you'll get a complete overview of what we offer, how the training works, and how it can help you get hired — even if you're from a non-IT background!</p>
            	        <div style="background-color: #2c006b; color: white; padding: 10px; font-weight: bold; margin-top: 20px;">
            	            Demo Session Details
            	        </div>
            	        <p><b>Date:</b> %s<br/><b>Time:</b> %s IST</p>
            	        <a href="https://your-link.com/demo-details" style="display: inline-block; margin-top: 20px; background-color: #3399ff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Demo Session Details</a>
            	        <p style="margin-top: 30px;">If you have any questions before the session, feel free to reply to this email.<br/>We look forward to seeing you there!</p>
            	        <p>Regards,<br/>Team Hachion</p>
            	    </body>
            	    </html>
            	""".formatted(enrollRequest.getName(), enrollRequest.getEnroll_date(), enrollRequest.getTime());

      

            helper.setText(htmlContent, true); // Enable HTML

            ClassPathResource logo = new ClassPathResource("images/logo.png");
            ClassPathResource banner = new ClassPathResource("images/unnamed.jpg");


            helper.addInline("logoImage", logo, "image/png");
            helper.addInline("bannerImage", banner, "image/jpeg");

            javaMailSender.send(mimeMessage);
        } catch (Exception e) {
            e.printStackTrace(); // Optional: log or rethrow
        }
    }


    // Send Set Password Email
    public void sendSetPasswordEmail(String email, String newPassword) {
        MimeMessage mimeMessage = javaMailSender.createMimeMessage();

        try {
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
            helper.setTo(email);
            helper.setSubject("Reset Your Password");

            String htmlContent = "<div style=\"padding: 30px; text-align: center; font-family: Arial, sans-serif;\">" +
                    "<img src='cid:logoImage' alt='Hachion Logo' style='height: 50px; margin-bottom: 20px;'/>" +
                    "<div style=\"background-color: #0056b3; color: white; padding: 10px; font-size: 24px; font-weight: bold;\">" +
                    "Reset Your Password</div>" +
                    "<div style=\"padding: 30px;\">" +
                    "<p style=\"font-size: 16px; color: #000;\">Hello Candidate,</p>" +
                    "<p style=\"font-size: 16px; color: #000;\">" +
                    "You have requested to reset your Hachion’s login password. Kindly enter the below Password to proceed further." +
                    "</p>" +
                    "<h2 style=\"letter-spacing: 10px; font-size: 30px; color: #000;\">" + newPassword + "</h2>" +
                    "<p style=\"font-size: 16px; color: #000;\">We look forward to seeing you back on Hachion.</p>" +
                    "<br><p style=\"color: #000;\">Regards,<br><i>Team Hachion</i></p>" +
                    "<hr style=\"margin: 30px 0;\">" +
                    "<p style=\"font-size: 12px; color: #666;\">" +
                    "Want to change how you receive these emails?<br>" +
                    "You can <a href=\"#\" style=\"color: #0056b3;\">update your preferences</a> or <a href=\"#\" style=\"color: #0056b3;\">unsubscribe</a>." +
                    "</p>" +
                    "</div>" +
                    "</div>";

            helper.setText(htmlContent, true);

            ClassPathResource res = new ClassPathResource("images/logo.png");
            helper.addInline("logoImage", res);
            // Attach the logo image
//            FileSystemResource res = new FileSystemResource("C:/Users/hp/uploads/images/logo.png"); // Your logo path
//            helper.addInline("logoImage", res);

            javaMailSender.send(mimeMessage);

        } catch (MessagingException e) {
            e.printStackTrace(); // handle error properly
        }
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
