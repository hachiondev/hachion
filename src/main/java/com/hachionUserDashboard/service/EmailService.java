package com.hachionUserDashboard.service;

import java.io.File;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.PaymentRequest;
import com.hachionUserDashboard.entity.Employee;
import com.hachionUserDashboard.repository.CurriculumRepository;
import com.hachionUserDashboard.repository.EmployeeRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender mailSender;

	@Value("${spring.mail.username}")
	private String adminEmail;

	// Shared prefix for everything under this profile's uploads bucket (see
	// application-{dev,test,prod}.properties) - getCurriculumUrl() below used
	// to hardcode .../uploads/prod/curriculum/ unconditionally, so a
	// curriculum PDF saved under the test bucket (CurriculumController's
	// file.upload-dir) would email a link into the prod bucket instead,
	// where that file was never uploaded.
	@Value("${app.uploads.public-base-url}")
	private String uploadsPublicBaseUrl;

	@Autowired
	private CurriculumRepository curriculumRepository;

	@Autowired
	private CommonEmailTemplateService commonEmailTemplateService;

	@Autowired
	private EmployeeRepository employeeRepository;

	private String buildCourseSlug(String courseName) {
		if (courseName == null || courseName.isBlank()) {
			return "";
		}

		String slug = courseName;
		try {
			slug = java.net.URLDecoder.decode(slug, java.nio.charset.StandardCharsets.UTF_8);
		} catch (Exception e) {

		}

		slug = slug.replaceAll("---+", " - ").replaceAll("\\b([a-zA-Z]{2,3})-(\\d{3})\\b", "$1@@$2")
				.replaceAll("[-_]+", " ").replaceAll("@@", "-").replaceAll("\\s+", " ").trim().toLowerCase();
		slug = slug.replace(" ", "_");

		return slug;
	}

	public void sendEmail(String to, String subject, String text) {
		SimpleMailMessage message = new SimpleMailMessage();
		message.setTo(to);
		message.setSubject(subject);
		message.setText(text);
		message.setFrom("trainings@hachion.co");

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

	public void sendInvoiceEmailForParitialPaid(String toEmail, String studentName, String courseName,
			double amountPaid, String currency, String invoicePath) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setSubject("✅ Payment Received – Your Enrollment for " + courseName + " is Confirmed");
			helper.setCc("trainings@hachion.co");

			String body = "<html><body style='font-family:Arial,sans-serif; color:#000000 !important;'>"
					+ "<p>Dear <strong>" + studentName + "</strong>,</p>"
					+ "<p>Thank you for completing the payment for the <strong>" + courseName
					+ "</strong>. We’re excited to have you onboard!</p>"
					+ "<p>We have successfully received your payment of <strong>" + String.format("%.2f", amountPaid)
					+ " " + currency + "</strong>, and your enrollment is now confirmed.</p>"
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
			helper.setCc("trainings@hachion.co");

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
			String currency, String invoicePath) {
		try {
			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setSubject("🎓 Hachion – Enrollment Confirmation & Invoice for " + courseName);
			helper.setCc("trainings@hachion.co");

			String emailBody = String
					.format("<div style='font-family:Arial, sans-serif; font-size:14px; color:#000000 !important;'>"
							+ "<p>Dear <strong style='color:#000000 !important;'>%s</strong>,</p>"
							+ "<p style='color:#000000 !important;'>Thank you for enrolling in the <strong>%s</strong> with Hachion.<br>"
							+ "We are pleased to confirm your registration. Please find your invoice attached to this email for your records.</p>"
							+ "<p style='color:#000000 !important;'><strong>💳 Payment Summary</strong><br>"
							+ "Course Fee: <strong>%.2f %s</strong><br>" + "Payment Method: <strong>Zelle</strong><br>"
							+ "Recipient Email: trainings@hachion.co<br>"
							+ "Recipient Name: <strong>HACH TECHNOLOGIES LLC</strong></p>"
							+ "<p style='color:#000000 !important;'>Should you have any questions or need further assistance, feel free to reach out. "
							+ "We’re excited to support you on your learning journey and wish you success in the upcoming training.</p>"
							+ "<p style='color:#000000 !important;'>Warm regards,<br><br>"
							+ "<strong>Team Hachion</strong><br>"
							+ "🌐 <a href='https://www.hachion.co'>www.hachion.co</a><br>" + "📞 +1 (732) 485-2499<br>"
							+ "📧 trainings@hachion.co</p>" + "</div>", studentName, courseName, courseFee, currency);

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
			String currency = paymentRequest.getCurrency();

			String fullName = paymentRequest.getStudentName();
			String studentFirstName = fullName != null && fullName.contains(" ") ? fullName.split(" ")[0] : fullName;

			String subject = "⏳ Friendly Reminder – Complete Payment to Confirm Your Enrollment for " + courseName;

			String htmlContent = String
					.format("<div style='font-family:Arial, sans-serif; font-size:14px; color:#000 !important;'>"
							+ "<p>Dear <strong>%s</strong>,</p>" + "<p>We hope you're doing well!</p>"
							+ "<p>This is a gentle reminder to complete your payment for the "
							+ "<strong>%s</strong> to secure your spot in the upcoming training.</p>"

							+ "<p><strong>💳 Course Fee & Payment Instructions</strong><br>"
							+ "Balance Course Fee: <strong>%.2f %s</strong><br>"
							+ "Payment Method: <strong>Zelle</strong><br>"
							+ "Recipient Email: <strong>trainings@hachion.co</strong><br>"
							+ "Recipient Name: <strong>HACH TECHNOLOGIES LLC</strong></p>"

							+ "<p>Once the payment is completed, you will receive a confirmation email along with your invoice and access details for the session.</p>"
							+ "<p>If you have any questions or need additional assistance, feel free to reach out to us.</p>"
							+ "<p>We look forward to having you in the batch and supporting your <strong>%s</strong> journey!</p>"

							+ "<br><p>Warm regards,<br><strong>Team Hachion</strong><br>"
							+ "🌐 <a href='https://www.hachion.co' style='color:#001f7f !important;'>www.hachion.co</a><br>"
							+ "📞 +1 (732) 485-2499<br>"
							+ "📧 <a href='mailto:trainings@hachion.co' style='color:#001f7f !important;'>trainings@hachion.co</a></p>"
							+ "</div>", studentFirstName, courseName, courseFee, currency, courseName);

			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(htmlContent, true); // true = HTML
			helper.setFrom("trainings@hachion.co");

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

			String currentYear = String.valueOf(java.time.LocalDate.now().getYear());

//			ClassPathResource resource = new ClassPathResource("templates/register_offline_students_email.html");
//			String htmlContent = Files.readString(resource.getFile().toPath(), StandardCharsets.UTF_8);

			ClassPathResource resource = new ClassPathResource("templates/register_offline_students_email.html");
			String htmlContent;
			try (InputStream inputStream = resource.getInputStream()) {
				htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
			}

			htmlContent = htmlContent.replace("[Student First Name]", safeUserName)
					.replace("[Student Email]", safeEmail).replace("Hach@123", safePassword)
					.replace("[Year]", currentYear);

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setCc("trainings@hachion.co");
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

			String currentYear = String.valueOf(java.time.LocalDate.now().getYear());

			ClassPathResource resource = new ClassPathResource("templates/register_online_students_email.html");
			String htmlContent;
			try (InputStream inputStream = resource.getInputStream()) {
				htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
			}
			htmlContent = htmlContent.replace("[Student First Name]", safeUserName).replace("[Year]", currentYear);
			;

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setCc("trainings@hachion.co");
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
			helper.setCc("trainings@hachion.co");
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
			helper.setCc("trainings@hachion.co");
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

	public void sendEmailForTwoDaysDue(PaymentRequest paymentRequest, java.time.LocalDate dueDate) {
		try {
			String to = paymentRequest.getEmail();
			String courseName = paymentRequest.getCourseName();
			double balancePay = paymentRequest.getBalancePay();
			String studentName = paymentRequest.getStudentName();

			String subject = "Reminder – Payment Due in 2 Days for Your " + (courseName == null ? "" : courseName);

			String balanceStr = String.format("%.2f", balancePay);
			String dueDateStr = (dueDate == null) ? ""
					: dueDate.format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy"));

			String htmlContent = "<div style='font-family:Arial, sans-serif; font-size:14px; color:#000 !important;'>"
					+ "<p style='color:#000 !important;'><strong style='color:#000 !important;'>Subject:</strong> Reminder – Payment Due in 2 Days for Your "
					+ (courseName == null ? "" : escape(courseName)) + "</p>"

					+ "<p style='color:#000 !important;'>Dear " + (studentName == null ? "" : escape(studentName))
					+ ",</p>"

					+ "<p style='color:#000 !important;'>This is a friendly reminder that your payment of "
					+ "<strong style='color:#000 !important;'>" + escape(balanceStr) + "</strong> for the "
					+ "<strong style='color:#000 !important;'>" + (courseName == null ? "" : escape(courseName))
					+ "</strong> " + "course is due on <strong style='color:#000 !important;'>" + escape(dueDateStr)
					+ "</strong> (in 2 days).</p>"

					+ "<p style='color:#000 !important;'>To avoid any last-minute rush or interruptions in your class schedule, we kindly request you to complete the payment on time.</p>"

					+ "<p style='color:#000 !important;'>👉 <strong style='color:#000 !important;'>Make your payment via:</strong><br/>"
					+ "Zelle – <a href='mailto:trainings@hachion.co' style='color:#001f7f;'>trainings@hachion.co</a><br/>"
					+ "PayPal – <a href='mailto:trainings@hachion.co' style='color:#001f7f;'>trainings@hachion.co</a></p>"

					+ "<p style='color:#000 !important;'>Once the payment is made, please share the transaction screenshot with our support team at "
					+ "<a href='mailto:trainings@hachion.co' style='color:#001f7f;'>trainings@hachion.co</a> for verification.</p>"

					+ "<p style='color:#000 !important;'>If you have already completed the payment, kindly disregard this message.</p>"

					+ "<p style='color:#000 !important;'>Best regards,<br/>"
					+ "<span style='color:#000 !important;'>Team Hachion</span></p>" + "</div>";

			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(htmlContent, true);
			helper.setFrom("trainings@hachion.co");

			mailSender.send(message);
		} catch (MessagingException e) {
			throw new RuntimeException("Failed to send D-2 reminder email", e);
		}
	}

	/**
	 * Optional small helper to HTML-escape dynamic text. Place anywhere in the same
	 * class.
	 */
	private static String escape(String s) {
		if (s == null)
			return "";
		return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;");
	}

	// Overdue (every 2 days) email — keeps your existing EmailService style & names
	public void sendEmailForOverdue(PaymentRequest paymentRequest, java.time.LocalDate dueDate) {
		try {
			String to = paymentRequest.getEmail();
			String courseName = paymentRequest.getCourseName();
			double balancePay = paymentRequest.getBalancePay();
			String studentName = paymentRequest.getStudentName();

			String subject = "Payment Overdue – Immediate Attention Required for "
					+ (courseName == null ? "" : courseName);

			String balanceStr = String.format("%.2f", balancePay);
			String dueDateStr = (dueDate == null) ? ""
					: dueDate.format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy"));

			String htmlContent = "<div style='font-family:Arial, sans-serif; font-size:14px; color:#000 !important;'>"
					+ "<p style='color:#000 !important;'><strong style='color:#000 !important;'>Subject:</strong> Payment Overdue – Immediate Attention Required for "
					+ (courseName == null ? "" : escape(courseName)) + "</p>"

					+ "<p style='color:#000 !important;'>Dear " + (studentName == null ? "" : escape(studentName))
					+ ",</p>"

					+ "<p style='color:#000 !important;'>This is a reminder that your payment of <strong style='color:#000 !important;'>"
					+ escape(balanceStr) + "</strong> for the <strong style='color:#000 !important;'>"
					+ (courseName == null ? "" : escape(courseName))
					+ "</strong> course, which was due on <strong style='color:#000 !important;'>" + escape(dueDateStr)
					+ "</strong>, is still pending.</p>"

					+ "<p style='color:#000 !important;'>To ensure uninterrupted access to your classes, we kindly request you to complete the payment immediately.</p>"

					+ "<p style='color:#000 !important;'>👉 <strong style='color:#000 !important;'>You can make the payment via:</strong><br/>"
					+ "Zelle – <a href='mailto:trainings@hachion.co' style='color:#001f7f;'>trainings@hachion.co</a><br/>"
					+ "PayPal – <a href='mailto:trainings@hachion.co' style='color:#001f7f;'>trainings@hachion.co</a></p>"

					+ "<p style='color:#000 !important;'>Once the payment is completed, please share the transaction screenshot with our support team at "
					+ "<a href='mailto:trainings@hachion.co' style='color:#001f7f;'>trainings@hachion.co</a> for verification.</p>"

					+ "<p style='color:#000 !important;'>If you have already completed the payment, please disregard this message.</p>"

					+ "<p style='color:#000 !important;'>Best regards,<br/>"
					+ "<span style='color:#000 !important;'>Team Hachion</span></p>" + "</div>";

			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(htmlContent, true);
			helper.setFrom("trainings@hachion.co");

			mailSender.send(message);
		} catch (MessagingException e) {
			throw new RuntimeException("Failed to send overdue (D+X) reminder email", e);
		}
	}

//	/** Small helper to HTML-escape dynamic text. */
//	private static String escape(String s) {
//	    if (s == null) return "";
//	    return s.replace("&", "&amp;")
//	            .replace("<", "&lt;")
//	            .replace(">", "&gt;");
//	}
	public void sendEmailForSevenDaysOverdue(PaymentRequest paymentRequest, java.time.LocalDate dueDate) {
		try {
			String to = paymentRequest.getEmail();
			String courseName = paymentRequest.getCourseName();
			double balancePay = paymentRequest.getBalancePay();
			String studentName = paymentRequest.getStudentName();

			String subject = "7-Day Overdue Notice – Action Required for " + (courseName == null ? "" : courseName);

			String balanceStr = String.format("%.2f", balancePay);
			String dueDateStr = (dueDate == null) ? ""
					: dueDate.format(java.time.format.DateTimeFormatter.ofPattern("MMM dd, yyyy"));

			String htmlContent = "<div style='font-family:Arial, sans-serif; font-size:14px; color:#000 !important;'>"
					+ "<p style='color:#000 !important;'>Dear " + (studentName == null ? "" : escape(studentName))
					+ ",</p>"

					+ "<p style='color:#000 !important;'>This is a follow-up regarding your pending payment of "
					+ "<strong style='color:#000 !important;'>" + escape(balanceStr) + "</strong> for "
					+ "<strong style='color:#000 !important;'>" + (courseName == null ? "" : escape(courseName))
					+ "</strong>, " + "originally due on <strong style='color:#000 !important;'>" + escape(dueDateStr)
					+ "</strong>. "
					+ "As of today, the payment is <strong style='color:#000 !important;'>7 days overdue</strong>.</p>"

					+ "<p style='color:#000 !important;'>To ensure your class access remains uninterrupted, please complete the payment immediately.</p>"

					+ "<p style='color:#000 !important;'><strong style='color:#000 !important;'>How to pay:</strong><br/>"
					+ "Zelle: <a href='mailto:trainings@hachion.co' style='color:#001f7f;'>trainings@hachion.co</a><br/>"
					+ "PayPal: <a href='mailto:trainings@hachion.co' style='color:#001f7f;'>trainings@hachion.co</a></p>"

					+ "<p style='color:#000 !important;'>Once completed, kindly email the payment screenshot to "
					+ "<a href='mailto:trainings@hachion.co' style='color:#001f7f;'>trainings@hachion.co</a> "
					+ "so we can verify and update your account.</p>"

					+ "<p style='color:#000 !important;'>If you have already paid, please reply with the screenshot so we can confirm and close this reminder.</p>"

					+ "<p style='color:#000 !important;'>If you’re facing any difficulty, reply to this email — we’re happy to help.</p>"

					+ "<p style='color:#000 !important;'>Best regards,<br/>"
					+ "<span style='color:#000 !important;'>Team Hachion</span><br/>"
					+ "📧 <a href='mailto:trainings@hachion.co' style='color:#001f7f;'>trainings@hachion.co</a></p>"
					+ "</div>";

			MimeMessage message = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(htmlContent, true);
			helper.setFrom("trainings@hachion.co");

			mailSender.send(message);
		} catch (MessagingException e) {
			throw new RuntimeException("Failed to send D+7 overdue reminder email", e);
		}
	}

	public void sendEmailForEnrollForSelfPaced(String toEmail, String studentFullName, String technologyName,
			String accessStartDate) throws MessagingException {

		try {
			String userName = (studentFullName != null && studentFullName.contains(" ")) ? studentFullName.split(" ")[0]
					: studentFullName;

			String safeUserName = userName != null ? userName : "Student";
			String safeTechnologyName = technologyName != null ? technologyName : "Your Course";
			String safeDate = accessStartDate != null ? accessStartDate : "";

			String htmlContent = "" + "<div style='font-family: Arial, sans-serif; color:#222; line-height:1.6;'>"
					+ "<h2>🎉 Welcome to Your Self-Paced " + safeTechnologyName + " Program! 🎉</h2>"
					+ "<p>Your journey to becoming a " + safeTechnologyName + " professional starts now.</p>"

					+ "<p>✅ <strong>Enrollment Confirmed!</strong></p>" + "<p>Hi <strong>" + safeUserName
					+ "</strong>,</p>" + "<p>" + "We’re excited to welcome you to the <strong>" + safeTechnologyName
					+ "</strong> Professional Program (Self-Paced Mode). "
					+ "You now have access to structured learning content designed to help you progress at your own pace with complete flexibility."
					+ "</p>"

					+ "<h3>🌟 Your Learning Access</h3>" + "<ul>"
					+ "<li>Learn anytime, anywhere at your convenience</li>"
					+ "<li>Access high-quality recorded sessions by expert trainers</li>"
					+ "<li>Follow a well-structured course curriculum</li>"
					+ "<li>Revisit topics as often as needed for better understanding</li>" + "</ul>"
					+ "<p>🕒 You’ll have extended access to course content based on your enrollment plan</p>"

					+ "<h3>📅 Program Details</h3>" + "<p>" + "<strong>Learning Mode:</strong> Self-Paced<br/>"
					+ "<strong>Access Start Date:</strong> " + safeDate + "<br/>"
					+ "<strong>Program Duration:</strong> 8 Weeks (Recommended timeline)<br/>"
					+ "<strong>Progress:</strong> Learn at your own speed" + "</p>"

					+ "<h3>🔗 Access Details</h3>" + "<p>"
					+ "<strong>Learning Platform:</strong> Online Learning Portal<br/>"
					+ "<strong>Availability:</strong> 24/7 access to course materials" + "</p>"

					+ "<p><strong>👉 Start learning today and move ahead with confidence!</strong><br/>"
					+ "We recommend setting a regular study schedule to get the best results from the program.</p>"
					+ "</div>";

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setCc("trainings@hachion.co");
			helper.setSubject("Welcome to Your Self-Paced " + safeTechnologyName + " Program");
			helper.setText(htmlContent, true);

			// If you want same inline images as Live Class, you can add them here too
			// helper.addInline("hachion-logo", new
			// ClassPathResource("templates/hachion_whiltecolour.png"));

			mailSender.send(mimeMessage);

		} catch (Exception e) {
			throw new MessagingException("Failed to send self-paced enrollment email", e);
		}
	}

	public void sendInstallmentRequestSubmittedEmail(String toEmail, String studentName, String courseName)
			throws MessagingException {

		try {
			String safeName = studentName != null ? studentName : "Student";
			String safeCourse = courseName != null ? courseName : "your course";

			// Build course URL using SAME slug logic as frontend
			String courseSlug = buildCourseSlug(safeCourse);
			String courseUrl = "https://hachion.co/coursedetails/" + courseSlug;

			// Fallback home URL
			String homeUrl = "https://hachion.co";

			String subject = "New Installment Request for " + safeCourse + " is Submitted | Action Required";

			String htmlContent = """
					<p>Dear %s,</p>
					<p>Greetings from Hachion 🌟</p>
					<p>Thank you for taking the next step in your learning journey with us.</p>
					<p>We’re happy to inform you that your request for the <b>%s</b> installment payment option has been successfully received.
					Our admin team is currently reviewing your request, and it will be approved shortly after acknowledgment.</p>

					<p><b>What you can expect next:</b></p>
					<ul>
					    <li>✔ Your installment request will be reviewed by our team</li>
					    <li>✔ You’ll receive a confirmation email once it’s approved</li>
					    <li>✔ After approval, you can proceed with enrollment without any hassle</li>
					</ul>

					<p>At Hachion, we’re committed to making quality learning accessible and flexible, so finances never hold back your career growth.</p>
					<p>If you need any assistance or have questions, our support team is always here to help.</p>

					<p><b>Useful links:</b></p>
					<p>
					    🔗 Course Page: <a href="%s">%s</a><br/>
					    🌐 Hachion Home: <a href="%s">%s</a>
					</p>

					<p>Warm regards,<br/>Team Hachion</p>
					"""
					.formatted(safeName, safeCourse, courseUrl, courseUrl, homeUrl, homeUrl);

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setCc("trainings@hachion.co");
			helper.setSubject(subject);
			helper.setText(htmlContent, true);

			mailSender.send(mimeMessage);

		} catch (Exception e) {
			throw new MessagingException("Failed to send installment request submitted email", e);
		}
	}

	public void sendInstallmentRequestAdminEmail(String userName, String userEmail, String courseName)
			throws MessagingException {

		try {
			String safeName = userName != null ? userName : "N/A";
			String safeEmail = userEmail != null ? userEmail : "N/A";
			String safeCourse = courseName != null ? courseName : "N/A";

			String subject = "Installment Request Received - We’re Reviewing It | Hachion";

			String htmlContent = """
					    <p>Dear Team,</p>
					    <p>Greetings from Hachion,</p>

					    <p>This is to notify you that a new installment request has been submitted by a learner on the Hachion platform.</p>

					    <p><b>Request Details:</b></p>
					    <p>
					        Learner Name: %s<br/>
					        Registered Email: %s<br/>
					        Course / Program: %s<br/>
					        Learning Mode: Live Class<br/>
					        Request Type: Installment Payment Option
					    </p>

					    <p><b>Next Step:</b><br/>
					    Please review the request and approve or acknowledge it at the earliest, so the learner can proceed with enrollment without delay.</p>

					    <p>Timely action helps us ensure a smooth learner experience and reinforces Hachion’s commitment to flexibility and learner support.</p>

					    <p>Thank you for your prompt attention.</p>

					    <p>Best regards,<br/>
					    <b>Hachion Platform Notification System</b><br/>
					    Online Training | Career-Focused Learning</p>

					    <p>🌐 <a href="https://www.hachion.co/">https://www.hachion.co/</a></p>
					"""
					.formatted(safeName, safeEmail, safeCourse);

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			// 🔔 Send to ADMIN email
//	        helper.setTo("trainings@hachion.co");  
			helper.setTo(adminEmail);

			helper.setSubject(subject);
			helper.setText(htmlContent, true);

			mailSender.send(mimeMessage);

		} catch (Exception e) {
			throw new MessagingException("Failed to send admin installment request email", e);
		}
	}

	public void sendInstallmentApprovedEmail(String toEmail, String studentName, String courseName)
			throws MessagingException {

		try {
			String safeName = studentName != null ? studentName : "Learner";
			String safeCourse = courseName != null ? courseName : "your course";

			String courseSlug = buildCourseSlug(safeCourse);
			String courseUrl = "https://hachion.co/coursedetails/" + courseSlug;

			// Fallback home URL
			String homeUrl = "https://hachion.co";

			String subject = "Installment Request for " + safeCourse + " Approved - You’re All Set to Enroll | Hachion";

			String htmlContent = """
					<p>Dear %s,</p>
					<p>Greetings from Hachion 🎉</p>

					<p>We’re pleased to inform you that your installment payment request for <b>%s</b> has been successfully reviewed and approved by our admin team.</p>

					<p><b>What’s next?</b></p>
					<ul>
					    <li>✔ Your installment option is now activated</li>
					    <li>✔ You can proceed with enrollment using the approved installment plan</li>
					    <li>✔ Start your learning journey without any payment stress</li>
					</ul>

					<p>We’re excited to support you in building skills that move your career forward. At Hachion, flexibility and learner success always come first.</p>

					<p>If you need any help while completing enrollment, feel free to reach out to our support team.</p>

					<p><b>Useful links:</b></p>
					<p>
					    🔗 Course Page: <a href="%s">%s</a><br/>
					    🌐 Hachion Home: <a href="%s">%s</a>
					</p>

					<p>Best regards,<br/>
					<b>Hachion Platform Notification System</b><br/>
					Online Training | Career-Focused Learning</p>
					"""
					.formatted(safeName, safeCourse, courseUrl, courseUrl, homeUrl, homeUrl);

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setSubject(subject);
			helper.setText(htmlContent, true);

			mailSender.send(mimeMessage);

		} catch (Exception e) {
			throw new MessagingException("Failed to send installment approval email", e);
		}
	}

	public void sendInstallmentRejectedEmail(String toEmail, String studentName, String courseName)
			throws MessagingException {

		try {
			String safeName = studentName != null ? studentName : "Learner";
			String safeCourse = courseName != null ? courseName : "your course";

			// Build course URL using SAME slug logic as frontend
			String courseSlug = buildCourseSlug(safeCourse);
			String courseUrl = "https://hachion.co/coursedetails/" + courseSlug;

			// Fallback home URL
			String homeUrl = "https://hachion.co";

			String subject = "Update on Your Installment Request | Hachion";

			String htmlContent = """
					<p>Dear %s,</p>
					<p>Greetings from Hachion,</p>

					<p>Thank you for your interest in the installment payment option.</p>

					<p>After careful review, we regret to inform you that your installment request for <b>%s</b> could not be approved at this time, as the selected installment details were not valid or did not meet the required criteria.</p>

					<p><b>What you can do next:</b></p>
					<ul>
					    <li>✔ Review your installment selection</li>
					    <li>✔ Reach out to your course instructor for guidance</li>
					    <li>✔ Contact our support team for further clarification and assistance</li>
					</ul>

					<p>Our team is always here to help you find the best possible way to continue your learning journey with Hachion.</p>

					<p>Thank you for your understanding and cooperation.</p>

					<p><b>Useful links:</b></p>
					<p>
					    🔗 Course Page: <a href="%s">%s</a><br/>
					    🌐 Hachion Home: <a href="%s">%s</a>
					</p>

					<p>Best regards,<br/>
					<b>Hachion Platform Notification System</b><br/>
					Online Training | Career-Focused Learning</p>
					"""
					.formatted(safeName, safeCourse, courseUrl, courseUrl, homeUrl, homeUrl);

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setSubject(subject);
			helper.setText(htmlContent, true);

			mailSender.send(mimeMessage);

		} catch (Exception e) {
			throw new MessagingException("Failed to send installment rejected email", e);
		}
	}

//	public void sendEmailForReactGoogleForm(
//	        String toEmail,
//	        String tempPassword,
//	        String studentFullName,
//	        String courseName
//	) throws MessagingException {
//
//	    try {
//
//	    	String safeUserName = (studentFullName != null && !studentFullName.trim().isEmpty())
//	    	        ? studentFullName.trim()
//	    	        : "Student";
//	        String safeEmail = toEmail != null ? toEmail : "";
//	        String safePassword = tempPassword != null ? tempPassword : "Hach@123";
//
//	        // ✅ Use your existing methods
//	        String courseUrl = generateCourseUrl(courseName);
//	        String curriculumUrl = getCurriculumUrl(courseName);
//
//	        String htmlContent =
//	                "<div style='font-family: Arial, sans-serif; line-height:1.8; color:#333;'>"
//
//	                        + "<p>Hello " + safeUserName + ",</p>"
//
//	                        + "<p style='font-size:16px;'><b>Welcome to Hachion! 🎉</b></p>"
//
//	                        + "<p>Thank you for registering with us. We’re excited to have you onboard and help you take the next step in your career.</p>"
//
//	                        + "<p>━━━━━━━━━━━━━━━━━━━</p>"
//	                        + "<p>🔐 Your Portal Access</p>"
//	                        + "<p>━━━━━━━━━━━━━━━━━━━</p>"
//
//	                        + "<p>"
//	                        + "Portal: <a href='https://www.hachion.co/login'>https://www.hachion.co/login</a><br/>"
//	                        + "Login Email: " + safeEmail + "<br/>"
//	                        + "Temporary Password: " + safePassword + "<br/><br/>"
//	                        + "👉 For security, please update your password after your first login."
//	                        + "</p>"
//
//	                        + "<p>━━━━━━━━━━━━━━━━━━━</p>"
//	                        + "<p><b>📚 Course Resources</b></p>"
//	                        + "<p>━━━━━━━━━━━━━━━━━━━</p>"
//
//	                        + "<p>"
//	                        + "📖 Course Page<br/>"
//	                        + "<a href='" + courseUrl + "'>" + courseUrl + "</a><br/><br/>"
//
//	                        + "📥 Curriculum (Syllabus PDF)<br/>"
//	                        + "<a href='" + curriculumUrl + "'>" + curriculumUrl + "</a><br/><br/>"
//
//+ "🎥 Book a Free Demo Session<br/>"
//+ "<a href='" + courseUrl + "'>" + courseUrl + "</a><br/>"
//+ "<span style='font-size:13px; color:#555;'>"
//+ "(User will be redirected to the <b>\"Try Before You Enroll\"</b> section on the course page)"
//+ "</span><br/><br/>"
//
//+ "<span style='font-size:13px; color:#555;'>"
//+ "If no demo sessions are available for this course, you can use the below option"
//+ "</span><br/>"
//+ "📱 Chat with us to schedule your demo<br/>"
//+ "<a href='https://wa.me/17324852499'>https://wa.me/17324852499</a>"
//+ "</p>"
//
//	                        + "<p>━━━━━━━━━━━━━━━━━━━</p>"
//	                        + "<p><b>🚀 What Happens Next?</b></p>"
//	                        + "<p>━━━━━━━━━━━━━━━━━━━</p>"
//
//	                        + "<p>"
//	                        + "✔ Our training coordinator will contact you within 24 hours<br/>"
//	                        + "✔ You’ll receive guidance on batches, schedules, and next steps<br/>"
//	                        + "✔ We’ll help you plan your learning path based on your goals"
//	                        + "</p>"
//
//	                        + "<p>━━━━━━━━━━━━━━━━━━━</p>"
//	                        + "<p><b>🤝 Need Help?</b></p>"
//	                        + "<p>━━━━━━━━━━━━━━━━━━━</p>"
//
//	                        + "<p>"
//	                        + "If you have any questions, feel free to reply to this email or contact us anytime.<br/><br/>"
//	                        + "📧 trainings@hachion.co<br/>"
//	                        + "🌐 <a href='https://www.hachion.co'>https://www.hachion.co</a>"
//	                        + "</p>"
//
//	                        + "<p>━━━━━━━━━━━━━━━━━━━</p>"
//
//	                        + "<p>We look forward to supporting your learning journey!</p>"
//
//	                        + "<p><b>Best Regards,<br/>Team Hachion</b></p>"
//
//	                        + "</div>";
//
//	        MimeMessage mimeMessage = mailSender.createMimeMessage();
//	        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");
//
//	        helper.setTo(toEmail);
//	        helper.setCc("trainings@hachion.co");
//	        helper.setSubject("Welcome to Hachion – Your Course Access 🚀");
//	        helper.setText(htmlContent, true);
//
//	        mailSender.send(mimeMessage);
//
//	    } catch (Exception e) {
//	        throw new MessagingException("Failed to send welcome email", e);
//	    }
//	}
	public void sendEmailForReactGoogleForm(String toEmail, String tempPassword, String studentFullName,
			String courseName) throws MessagingException {

		try {

			String safeUserName = (studentFullName != null && !studentFullName.trim().isEmpty())
					? studentFullName.trim()
					: "Student";

			String safeEmail = toEmail != null ? toEmail : "";
			String safePassword = tempPassword != null ? tempPassword : "Hach@123";

			String courseUrl = generateCourseUrl(courseName);
			String curriculumUrl = getCurriculumUrl(courseName);

			String htmlContent = "<div style='font-family: Arial, sans-serif; color:#333; line-height:1.6;'>"

					// Greeting
					+ "<div>Hello " + safeUserName + ",</div><br/>"

					+ "<div style='font-size:16px; font-weight:bold;'>Welcome to Hachion! 🎉</div><br/>"

					+ "<div>Thank you for registering with us. We’re excited to have you onboard and help you take the next step in your career.</div><br/><br/>"

					// Portal Access
					+ "<div style='font-weight:bold; font-size:15px;'>🔐 Your Portal Access</div><br/>"

					+ "<div>" + "Portal: <a href='https://www.hachion.co/login'>https://www.hachion.co/login</a><br/>"
					+ "Login Email: " + safeEmail + "<br/>" + "Temporary Password: " + safePassword + "<br/>"
					+ "<span style='font-size:13px;'>👉 For security, please update your password after your first login.</span>"
					+ "</div><br/><br/>"

					// Course Resources
					+ "<div style='font-weight:bold; font-size:15px;'>📚 Course Resources</div><br/>"

					+ "<div>" + "📖 Course Page<br/>" + "<a href='" + courseUrl + "'>" + courseUrl + "</a><br/><br/>"

					+ "📥 Curriculum (Syllabus PDF)<br/>" + "<a href='" + curriculumUrl + "'>" + curriculumUrl
					+ "</a><br/><br/>"

					+ "🎥 Book a Free Demo Session<br/>" + "<a href='" + courseUrl + "'>" + courseUrl + "</a><br/><br/>"

					+ "<span style='font-size:13px; color:#555;'>"
					+ "If no demo sessions are available for this course, you can use the below option"
					+ "</span><br/><br/>"

					+ "📱 Chat with us to schedule your demo<br/>"
					+ "<a href='https://wa.me/17324852499'>https://wa.me/17324852499</a>" + "</div><br/><br/>"

					// What Next
					+ "<div style='font-weight:bold; font-size:15px;'>🚀 What Happens Next?</div><br/>"

					+ "<div>" + "✔ Our training coordinator will contact you within 24 hours<br/>"
					+ "✔ You’ll receive guidance on batches, schedules, and next steps<br/>"
					+ "✔ We’ll help you plan your learning path based on your goals" + "</div><br/><br/>"

					// Help Section
					+ "<div style='font-weight:bold; font-size:15px;'>🤝 Need Help?</div><br/>"

					+ "<div>"
					+ "If you have any questions, feel free to reply to this email or contact us anytime.<br/><br/>"
					+ "📧 trainings@hachion.co<br/>" + "🌐 <a href='https://www.hachion.co'>https://www.hachion.co</a>"
					+ "</div><br/><br/>"

					// Closing
					+ "<div>We look forward to supporting your learning journey!</div><br/>"

					+ "<div><b>Best Regards,<br/>Team Hachion</b></div>"

					+ "</div>";
			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(toEmail);
			helper.setCc("trainings@hachion.co");
			helper.setSubject("Welcome to Hachion – Your Course Access 🚀");
			helper.setText(htmlContent, true);

			mailSender.send(mimeMessage);

		} catch (Exception e) {
			throw new MessagingException("Failed to send welcome email", e);
		}
	}

	private String generateCourseUrl(String courseName) {

		if (courseName == null || courseName.isEmpty()) {
			return "https://hachion.co/coursedetails/";
		}

		try {
			// Step 1: decode (same as decodeURIComponent)
			String decoded = java.net.URLDecoder.decode(courseName, java.nio.charset.StandardCharsets.UTF_8);

			// Step 2: apply SAME regex logic as frontend
			decoded = decoded.replaceAll("---+", " - ").replaceAll("\\b([a-zA-Z]{2,3})-(\\d{3})\\b", "$1@@$2")
					.replaceAll("[-_]+", " ").replaceAll("@@", "-").replaceAll("\\s+", " ").trim().toLowerCase();

			// Step 3: convert back to slug (URL format)
			String slug = decoded.replaceAll("\\s+", "-"); // same frontend routing expectation

			return "https://hachion.co/coursedetails/" + slug;

		} catch (Exception e) {
			return "https://hachion.co/coursedetails/" + courseName.toLowerCase();
		}
	}

	private String getCurriculumUrl(String courseName) {

//		String filePath = curriculumRepository.findCurriculumByCourseName(courseName);
		List<String> filePaths = curriculumRepository.findCurriculumByCourseName(courseName);

		String filePath = (filePaths != null && !filePaths.isEmpty()) ? filePaths.get(0) : null;
		if (filePath == null || filePath.isEmpty()) {
			return "https://hachion.co";
		}

		String baseUrl = uploadsPublicBaseUrl + "curriculum/";

		// Split folder + file name
		int lastSlash = filePath.lastIndexOf("/");

		String folder = filePath.substring(0, lastSlash + 1); // pdfs/
		String fileName = filePath.substring(lastSlash + 1); // actual file

		// Encode only file name
		String encodedFileName = java.net.URLEncoder.encode(fileName, java.nio.charset.StandardCharsets.UTF_8)
				.replace("+", "%20");

		return baseUrl + folder + encodedFileName;
	}

	public void sendDynamicEmail(String to, String subject, String body) throws MessagingException {

		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);

		helper.setTo(to);
		helper.setSubject(subject);
		helper.setText(body.replace("\n", "<br>"), true);

		mailSender.send(message);
	}

	public void sendDynamicEmailWithCC(String to, String cc, String subject, String body) throws MessagingException {

		MimeMessage message = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper(message, true);

		helper.setTo(to);

		if (cc != null && !cc.isEmpty()) {
			helper.setCc(cc);
		}

		helper.setSubject(subject);
//	    helper.setText(body.replace("\n", "<br>"), true);
		helper.setText(body, true);

		mailSender.send(message);
	}

//	public void sendUnsubscribeConfirmation(String email, String userName) {
//
//		try {
//
//			String greeting;
//
//			if (userName != null && !userName.trim().isEmpty()) {
//				greeting = "Hi " + userName + ",";
//			} else {
//				greeting = "Hi,";
//			}
//
//			String subject = "You’ve Been Unsubscribed from Hachion Updates";
//
//			String body = """
//					%s
//
//					We’ve received your request to unsubscribe from Hachion updates, and you’ve been successfully removed from our mailing list.
//
//					We’re sorry to see you go. At Hachion, our goal is to share valuable insights, practical learning resources, and career-focused training to help you stay ahead. If our emails didn’t meet your expectations, we truly appreciate your time and would love to improve.
//
//					If you ever wish to reconnect, you’re always welcome back to explore new courses and updates with us.
//
//					In case this was unintentional, or you’d like to manage your preferences instead, you can re-subscribe anytime.
//
//					Thank you for being a part of Hachion. Wishing you continued success in your learning journey.
//
//					Warm regards,
//					The Hachion Team
//					"""
//					.formatted(greeting);
//
//			sendSimpleEmail(email, subject, body);
//
//		} catch (Exception e) {
//			e.printStackTrace();
//		}
//	}
	public void sendUnsubscribeConfirmation(String email, String userName) {

		try {

			String greeting;

			if (userName != null && !userName.trim().isEmpty() && !"null".equalsIgnoreCase(userName.trim())) {

				greeting = "Hi " + userName + ",";
			} else {
				greeting = "Hi,";
			}

			String subject = "You’ve Been Unsubscribed from Hachion Updates";

			String dynamicContent = greeting
					+ """


											We’ve received your request to unsubscribe from Hachion updates, and you’ve been successfully removed from our mailing list.

							We’re sorry to see you go. At Hachion, our goal is to share valuable insights, practical learning resources, and career-focused training to help you stay ahead. If our emails didn’t meet your expectations, we truly appreciate your time and would love to improve.

							If you ever wish to reconnect, you’re always welcome back to explore new courses and updates with us.

							In case this was unintentional, or you’d like to manage your preferences instead, you can re-subscribe anytime.

							Thank you for being a part of Hachion. Wishing you continued success in your learning journey.

												Warm regards,
												The Hachion Team
												""";

			String htmlBody = commonEmailTemplateService.buildEmailTemplate(userName, dynamicContent);

			sendHtmlEmail(email, subject, htmlBody);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void sendHtmlEmail(String to, String subject, String htmlBody) {

		try {

			MimeMessage message = mailSender.createMimeMessage();

			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(to);
			helper.setSubject(subject);
			helper.setText(htmlBody, true);

			mailSender.send(message);

			System.out.println("✅ HTML Email Sent Successfully to: " + to);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void sendSimpleEmail(String to, String subject, String body) {

		try {

			SimpleMailMessage message = new SimpleMailMessage();

			message.setTo(to);
			message.setSubject(subject);
			message.setText(body);

			mailSender.send(message);

			System.out.println("✅ Unsubscribe confirmation email sent to: " + to);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void sendEmailForRegisterOffline(String toEmail, String tempPassword, String studentFullName,
			String coordinator) throws MessagingException {
		try {

			String userName = (studentFullName != null && studentFullName.contains(" ")) ? studentFullName.split(" ")[0]
					: studentFullName;

			String safeUserName = userName != null ? userName : "Student";
			String safeEmail = toEmail != null ? toEmail : "";
			String safePassword = tempPassword != null ? tempPassword : "Hach@123";

			String currentYear = String.valueOf(java.time.LocalDate.now().getYear());

//			ClassPathResource resource = new ClassPathResource("templates/register_offline_students_email.html");
//			String htmlContent = Files.readString(resource.getFile().toPath(), StandardCharsets.UTF_8);

			ClassPathResource resource = new ClassPathResource("templates/register_offline_students_email.html");
			String htmlContent;
			try (InputStream inputStream = resource.getInputStream()) {
				htmlContent = new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
			}

			htmlContent = htmlContent.replace("[Student First Name]", safeUserName)
					.replace("[Student Email]", safeEmail).replace("Hach@123", safePassword)
					.replace("[Year]", currentYear);

			MimeMessage mimeMessage = mailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(toEmail);
//			helper.setCc("trainings@hachion.co");
			if (coordinator != null && !coordinator.trim().isEmpty()) {

				Optional<Employee> employeeOptional = employeeRepository.findByNameIgnoreCase(coordinator);

				if (employeeOptional.isPresent()) {

					String coordinatorEmail = employeeOptional.get().getEmail();

					if (coordinatorEmail != null && !coordinatorEmail.trim().isEmpty()) {

						helper.setCc(coordinatorEmail);
					}
				}
			}
			helper.setSubject("Welcome to Hachion");
			helper.setText(htmlContent, true);

			helper.addInline("hachion-logo", new ClassPathResource("templates/logo.png"));

			mailSender.send(mimeMessage);

		} catch (Exception e) {
			throw new MessagingException("Failed to send welcome email", e);
		}
	}

}
