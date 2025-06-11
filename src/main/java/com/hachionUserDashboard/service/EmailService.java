package com.hachionUserDashboard.service;

import java.io.File;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

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

	public void sendEmailWithAttachment(String to, byte[] attachmentBytes, String subject, String body)
			throws MessagingException {

		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);

		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(body);
		helper.addAttachment("Certificate.pdf", new ByteArrayResource(attachmentBytes));

		mailSender.send(message);
	}

	public void sendInvoiceEmail(String toEmail, String studentName, String invoicePath) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			helper.setTo(toEmail);
			helper.setSubject("Invoice from Hachion");
			helper.setText("Dear " + studentName + ",\n\nPlease find your invoice attached.\n\nRegards,\nHachion");
			helper.setCc("hachion.trainings@gmail.com");

			FileSystemResource file = new FileSystemResource(new File(invoicePath));
			helper.addAttachment("Invoice.pdf", file);

			mailSender.send(message);

		} catch (MessagingException e) {
			System.err.println("Failed to send email: " + e.getMessage());
			throw new RuntimeException("Email sending failed", e);
		}
	}

	public void sendEmailForReminder(String to, String subject, String htmlContent) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true);

			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(htmlContent, true);
			helper.setFrom("hachion.trainings@gmail.com");

			mailSender.send(message);
		} catch (MessagingException e) {
			throw new RuntimeException("Failed to send email", e);
		}
	}

	public void sendEmailForRegisterOfflineStudent(String toEmail, String tempPassword, String studentFullName)
			throws MessagingException {
		try {

			String userName = (studentFullName != null && studentFullName.contains(" ")) ? studentFullName.split(" ")[0]
					: studentFullName;

			String safeUserName = userName != null ? userName : "Student";
			String safeEmail = toEmail != null ? toEmail : "";
			String safePassword = tempPassword != null ? tempPassword : "Hach@123";

//			ClassPathResource resource = new ClassPathResource("templates/register_offline_students_email.html");
//			String htmlContent = Files.readString(resource.getFile().toPath(), StandardCharsets.UTF_8);

			ClassPathResource resource = new ClassPathResource("templates/register_offline_students_email.html");
			String htmlContent;
			try (InputStream inputStream = resource.getInputStream()) {
				htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
			}

			htmlContent = htmlContent.replace("[Student First Name]", safeUserName)
					.replace("[Student Email]", safeEmail).replace("Hach@123", safePassword);

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setCc("hachion.trainings@gmail.com");
			helper.setSubject("Welcome to Hachion");
			helper.setText(htmlContent, true);

//			File logoFile = new ClassPathResource("templates/logo.png").getFile();
//			helper.addInline("hachion-logo", logoFile);

			helper.addInline("hachion-logo", new ClassPathResource("templates/logo.png"));

			mailSender.send(mimeMessage);

		} catch (Exception e) {
			throw new MessagingException("Failed to send welcome email", e);
		}
	}

	public void sendEmailForRegisterOnlineStudent(String toEmail, String studentFullName) throws MessagingException {
		try {

			String userName = (studentFullName != null && studentFullName.contains(" ")) ? studentFullName.split(" ")[0]
					: studentFullName;

			String safeUserName = userName != null ? userName : "Student";

			ClassPathResource resource = new ClassPathResource("templates/register_online_students_email.html");
			String htmlContent;
			try (InputStream inputStream = resource.getInputStream()) {
				htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
			}
			htmlContent = htmlContent.replace("[Student First Name]", safeUserName);

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setCc("hachion.trainings@gmail.com");
			helper.setSubject("Welcome to Hachion");
			helper.setText(htmlContent, true);

//			File logoFile = new ClassPathResource("templates/logo.png").getFile();
//			helper.addInline("hachion-logo", logoFile);
			helper.addInline("hachion-logo", new ClassPathResource("templates/logo.png"));

			mailSender.send(mimeMessage);

		} catch (Exception e) {
			throw new MessagingException("Failed to send welcome email", e);
		}
	}

	public void sendEmailForEnrollForLiveDemo(String toEmail, String technologyName, String day, String date,
			String time, String timezone, String googleMeetLink, String meetingId, String passcode,
			String instructorName, String experience, String company, String version, String feature, String percentage,
			String salaryAmount, String keyConcept, String calendarLink, String technologySlug)
			throws MessagingException {
		try {

			String safeTechnologyName = technologyName != null ? technologyName : "Technology";

			ClassPathResource resource = new ClassPathResource("templates/course_enroll_email2.html");
			String htmlContent;
			try (InputStream inputStream = resource.getInputStream()) {
				htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
			}

			htmlContent = htmlContent.replace("[Technology Name]", technologyName != null ? technologyName : "")
					.replace("[Day]", day != null ? day : "").replace("[Date]", date != null ? date : "")
					.replace("[Time]", time != null ? time : "").replace("[Timezone]", timezone != null ? timezone : "")
					.replace("[Google Meet Link]", googleMeetLink != null ? googleMeetLink : "")
					.replace("[Meeting ID]", meetingId != null ? meetingId : "")
					.replace("[Passcode]", passcode != null ? passcode : "")
					.replace("[Instructor Name]", instructorName != null ? instructorName : "")
					.replace("[Experience]", experience != null ? experience : "")
					.replace("[Company]", company != null ? company : "")
					.replace("[Technology]", technologyName != null ? technologyName : "")
					.replace("[Version]", version != null ? version : "")
					.replace("[Feature]", feature != null ? feature : "")
					.replace("[Percentage]", percentage != null ? percentage : "")
					.replace("[Amount]", salaryAmount != null ? salaryAmount : "")
					.replace("[Key Concept]", keyConcept != null ? keyConcept : "")
					.replace("[Google Calendar Link]", calendarLink != null ? calendarLink : "")
					.replace("[Technology Slug]", technologySlug != null ? technologySlug : "");

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setCc("hachion.trainings@gmail.com");
			helper.setSubject("Your Exclusive Demo Session - " + safeTechnologyName);
			helper.setText(htmlContent, true);

			helper.addInline("hachion-logo", new ClassPathResource("templates/hachion_whiltecolour.png"));
			helper.addInline("linkedin-icon", new ClassPathResource("templates/linkedin.png"));
			helper.addInline("instagram-icon", new ClassPathResource("templates/instagram.png"));
			helper.addInline("facebook-icon", new ClassPathResource("templates/facebook.png"));
			helper.addInline("youtube-icon", new ClassPathResource("templates/youtube.png"));
//			helper.addInline("twitter-icon", new ClassPathResource("templates/twitter.png"));

			mailSender.send(mimeMessage);

		} catch (Exception e) {
			throw new MessagingException("Failed to send demo session email", e);
		}
	}

	public void sendEmailForEnrollForLiveClass(String toEmail, String studentFullName, String technologyName,
			String day, String date, String time, String timezone, String googleMeetLink, String meetingId,
			String passcode, String instructorName, String experience, String company, String version, String feature,
			String percentage, String salaryAmount, String keyConcept, String calendarLink, String technologySlug) throws MessagingException {
		try {

			String userName = (studentFullName != null && studentFullName.contains(" ")) ? studentFullName.split(" ")[0]
					: studentFullName;

			String safeUserName = userName != null ? userName : "Student";

			String safeTechnologyName = technologyName != null ? technologyName : "Technology";

			ClassPathResource resource = new ClassPathResource("templates/course_live_class_enroll_email.html");
			String htmlContent;
			try (InputStream inputStream = resource.getInputStream()) {
				htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
			}

			htmlContent = htmlContent.replace("[Student Name]", safeUserName != null ? safeUserName : "")
					.replace("[Technology Name]", technologyName != null ? technologyName : "")
					.replace("[Days]", day != null ? day : "").replace("[Start Date]", date != null ? date : "")
					.replace("[Time]", time != null ? time : "").replace("[Timezone]", timezone != null ? timezone : "")
					.replace("[Google Meet Link]", googleMeetLink != null ? googleMeetLink : "")
					.replace("[Meeting ID]", meetingId != null ? meetingId : "")
					.replace("[Passcode]", passcode != null ? passcode : "")
					.replace("[Instructor Name]", instructorName != null ? instructorName : "")
					.replace("[Experience]", experience != null ? experience : "")
					.replace("[Company]", company != null ? company : "")
					.replace("[Technology]", technologyName != null ? technologyName : "")
					.replace("[Version]", version != null ? version : "")
					.replace("[Feature]", feature != null ? feature : "")
					.replace("[Percentage]", percentage != null ? percentage : "")
					.replace("[Amount]", salaryAmount != null ? salaryAmount : "")
					.replace("[Key Concept]", keyConcept != null ? keyConcept : "")
					.replace("[Google Calendar Link]", calendarLink != null ? calendarLink : "")
					.replace("[Technology Slug]", technologySlug != null ? technologySlug : "");

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setCc("hachion.trainings@gmail.com");
			helper.setSubject("Your Exclusive Live Class - " + safeTechnologyName);
			helper.setText(htmlContent, true);

			helper.addInline("hachion-logo", new ClassPathResource("templates/hachion_whiltecolour.png"));
			helper.addInline("linkedin-icon", new ClassPathResource("templates/linkedin.png"));
			helper.addInline("instagram-icon", new ClassPathResource("templates/instagram.png"));
			helper.addInline("facebook-icon", new ClassPathResource("templates/facebook.png"));
			helper.addInline("youtube-icon", new ClassPathResource("templates/youtube.png"));
//			helper.addInline("twitter-icon", new ClassPathResource("templates/twitter.png"));

			mailSender.send(mimeMessage);

		} catch (Exception e) {
			throw new MessagingException("Failed to send demo session email", e);
		}
	}

}
