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

import com.hachionUserDashboard.dto.PaymentRequest;

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

//	public void sendInvoiceEmail(String toEmail, String studentName, String invoicePath) {
//		try {
//			MimeMessage message = mailSender.createMimeMessage();
//			MimeMessageHelper helper = new MimeMessageHelper(message, true);
//
//			helper.setTo(toEmail);
//			helper.setSubject("Invoice from Hachion");
//			helper.setText("Dear " + studentName + ",\n\nPlease find your invoice attached.\n\nRegards,\nHachion");
//			helper.setCc("hachion.trainings@gmail.com");
//
//			FileSystemResource file = new FileSystemResource(new File(invoicePath));
//			helper.addAttachment("Invoice.pdf", file);
//
//			mailSender.send(message);
//
//		} catch (MessagingException e) {
//			System.err.println("Failed to send email: " + e.getMessage());
//			throw new RuntimeException("Email sending failed", e);
//		}
//	}

	public void sendInvoiceEmailForParitialPaid(String toEmail, String studentName, String courseName,
			double amountPaid, String invoicePath) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setSubject("✅ Payment Received – Your Enrollment for " + courseName + " is Confirmed");
			helper.setCc("hachion.trainings@gmail.com");

			String body = "<html><body style='font-family:Arial,sans-serif; color:#000000 !important;'>"
					+ "<p>Dear <strong>" + studentName + "</strong>,</p>"
					+ "<p>Thank you for completing the payment for the <strong>" + courseName
					+ "</strong>. We’re excited to have you onboard!</p>"
					+ "<p>We have successfully received your payment of <strong>" + String.format("%.2f", amountPaid)
					+ " USD</strong>, and your enrollment is now confirmed.</p>"
					+ "<p>Please find your invoice attached to this email for your records.</p>"
					+ "<p><strong>🚀 Next Steps:</strong></p>" + "<ul>"
					+ "<li>📱 A WhatsApp group will be created for the batch and the trainer — you’ll be added shortly</li>"
					+ "<li>🏫 You will be added to Google Classroom for access to daily class recordings</li>"
					+ "<li>📝 Daily assignments will be posted in the course page under the curriculum section</li>"
					+ "<li>📬 The trainer will be available via WhatsApp and email to assist with all course-related queries</li>"
					+ "<li>📧 Your Google Meet link and joining instructions will be shared one day before the session begins</li>"
					+ "</ul>" + "<p style='color:#000000 !important;'>We're looking forward to supporting your "
					+ courseName + " learning journey and helping you achieve success.</p>"

					+ "<p style='color:#000000 !important;'>Warm regards,<br>Team Hachion</p>"
					+ "🌐 <a href='https://www.hachion.co'>www.hachion.co</a><br>" + "📞 +1 (732) 485-2499<br>"
					+ "📧 trainings@hachion.co</p>" + "</body></html>";

			helper.setText(body, true);

			FileSystemResource file = new FileSystemResource(new File(invoicePath));
			helper.addAttachment("Invoice.pdf", file);

			mailSender.send(message);
		} catch (MessagingException e) {
			System.err.println("Failed to send partial payment invoice email: " + e.getMessage());
			throw new RuntimeException("Email sending failed", e);
		}
	}

	public void sendInvoiceEmailForPaid(String toEmail, String studentName, String courseName, double courseFee,
			String invoicePath) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setSubject("🧾 Final Invoice – " + courseName + " Training (Paid in Full)");
			helper.setCc("hachion.trainings@gmail.com");

			String body = "<html><body style='font-family:Arial,sans-serif; color:#000000 !important;'>"
					+ "<p>Dear <strong>" + studentName + "</strong>,</p>"
					+ "<p>Thank you once again for enrolling in the <strong>" + courseName
					+ "</strong> Batch with Hachion.</p>"
					+ "<p>We’re pleased to confirm that we have received your full payment of <strong>"
					+ String.format("%.2f", courseFee) + " USD</strong>.</p>"
					+ "<p>Attached is your final invoice, marked “Paid in Full”, for your records.</p>"
					+ "<p><strong>🚀 What Happens Next</strong></p>" + "<ul>"
					+ "<li>✅ You'll be added to the batch WhatsApp group with the trainer</li>"
					+ "<li>✅ Access to Google Classroom for daily class recordings</li>"
					+ "<li>✅ Daily assignments will be posted in the curriculum section</li>"
					+ "<li>✅ The trainer will be available via WhatsApp/email to support you throughout the course</li>"
					+ "<li>📩 Google Meet link will be shared one day prior to the first session</li>" + "</ul>"
					+ "<p>If you have any questions or need help accessing resources, please feel free to reach out.</p>"
					+ "<p>We look forward to seeing you in class!</p>"
					+ "<p style='color:#000000 !important;'>Warm regards,<br>Team Hachion</p>"
					+ "🌐 <a href='https://www.hachion.co'>www.hachion.co</a><br>" + "📞 +1 (732) 485-2499<br>"
					+ "📧 trainings@hachion.co</p>" + "</body></html>";

			helper.setText(body, true);

			FileSystemResource file = new FileSystemResource(new File(invoicePath));
			helper.addAttachment("Invoice.pdf", file);

			mailSender.send(message);
		} catch (MessagingException e) {
			System.err.println("Failed to send paid in full invoice email: " + e.getMessage());
			throw new RuntimeException("Email sending failed", e);
		}
	}

	public void sendInvoiceEmail(String toEmail, String studentName, String courseName, double courseFee,
			String invoicePath) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setSubject("🎓 Hachion – Enrollment Confirmation & Invoice for " + courseName);
			helper.setCc("hachion.trainings@gmail.com");

			String emailBody = String.format(
					"<div style='font-family:Arial, sans-serif; font-size:14px; color:#000000 !important;'>"
							+ "<p>Dear <strong style='color:#000000 !important;'>%s</strong>,</p>"
							+ "<p style='color:#000000 !important;'>Thank you for enrolling in the <strong>%s</strong> with Hachion.<br>"
							+ "We are pleased to confirm your registration. Please find your invoice attached to this email for your records.</p>"
							+ "<p style='color:#000000 !important;'><strong>💳 Payment Summary</strong><br>"
							+ "Course Fee: <strong>%.2f USD</strong><br>" + "Payment Method: <strong>Zelle</strong><br>"
							+ "Recipient Email: trainings@hachion.co<br>"
							+ "Recipient Name: <strong>HACH TECHNOLOGIES LLC</strong></p>"
							+ "<p style='color:#000000 !important;'>Should you have any questions or need further assistance, feel free to reach out. "
							+ "We’re excited to support you on your learning journey and wish you success in the upcoming training.</p>"
							+ "<p style='color:#000000 !important;'>Warm regards,<br><br>"
							+ "<strong>Team Hachion</strong><br>"
							+ "🌐 <a href='https://www.hachion.co'>www.hachion.co</a><br>" + "📞 +1 (732) 485-2499<br>"
							+ "📧 trainings@hachion.co</p>" + "</div>",
					studentName, courseName, courseFee, invoicePath);

			helper.setText(emailBody, true); // 'true' enables HTML

			FileSystemResource file = new FileSystemResource(new File(invoicePath));
			helper.addAttachment("Invoice.pdf", file);

			mailSender.send(message);
		} catch (MessagingException e) {
			System.err.println("Failed to send email: " + e.getMessage());
			throw new RuntimeException("Email sending failed", e);
		}
	}

	public void sendEmailForReminder(PaymentRequest paymentRequest) {
		try {
			String to = paymentRequest.getEmail();
			String courseName = paymentRequest.getCourseName();
			double courseFee = paymentRequest.getBalancePay();

			String fullName = paymentRequest.getStudentName();
			String studentFirstName = fullName != null && fullName.contains(" ") ? fullName.split(" ")[0] : fullName;

			String subject = "⏳ Friendly Reminder – Complete Payment to Confirm Your Enrollment for " + courseName;

			String htmlContent = String.format(
					"<div style='font-family:Arial, sans-serif; font-size:14px; color:#333;'>"
							+ "<p>Dear <strong>%s</strong>,</p>" + "<p>We hope you're doing well!</p>"
							+ "<p>This is a gentle reminder to complete your payment for the <strong>%s</strong> to secure your spot in the upcoming training.</p>"
							+ "<p><strong>💳 Course Fee & Payment Instructions</strong><br>"
							+ "Course Fee: <strong>%.2f USD/INR</strong><br>"
							+ "Payment Method: <strong>Zelle</strong><br>"
							+ "Recipient Email: <strong>trainings@hachion.co</strong><br>"
							+ "Recipient Name: <strong>HACH TECHNOLOGIES LLC</strong></p>"
							+ "<p>Once the payment is completed, you will receive a confirmation email along with your invoice and access details for the session.</p>"
							+ "<p>If you have any questions or need additional assistance, feel free to reach out to us.</p>"
							+ "<p>We look forward to having you in the batch and supporting your <strong>%s</strong> journey!</p>"
							+ "<br><p>Warm regards,<br><strong>Team Hachion</strong><br>"
							+ "🌐 <a href='https://www.hachion.co'>www.hachion.co</a><br>" + "📞 +1 (732) 485-2499<br>"
							+ "📧 trainings@hachion.co</p>" + "</div>",
					studentFirstName, courseName, courseFee, courseName);

			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(htmlContent, true); // true = HTML
			helper.setFrom("hachion.trainings@gmail.com");

			mailSender.send(message);
		} catch (MessagingException e) {
			throw new RuntimeException("Failed to send reminder email", e);
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
			String percentage, String salaryAmount, String keyConcept, String calendarLink, String technologySlug)
			throws MessagingException {
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
