package com.hachionUserDashboard.cronjobs;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.entity.Employee;
import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.repository.EmployeeRepository;
import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.hachionUserDashboard.repository.StudentRemarksHistoryRepository;
import com.hachionUserDashboard.service.EmailReplyReaderService;
import com.hachionUserDashboard.service.EmailService;
import com.hachionUserDashboard.service.OpenAIService;

@Service
public class EmailCronService {

	@Autowired
	private RegisterStudentRepository repository;

	@Autowired
	private StudentRemarksHistoryRepository remarksRepository;

	@Autowired
	private EmployeeRepository employeeRepository;

	@Autowired
	private OpenAIService openAIService;

	@Autowired
	private EmailService emailService;

	@Autowired
	private EmailReplyReaderService emailReplyReaderService;

	public void sendSingleEmail(String studentId) {

		Optional<RegisterStudent> optionalStudent = repository.findByStudentId(studentId);

		if (!optionalStudent.isPresent()) {
			System.out.println("❌ Student not found");
			return;
		}

		RegisterStudent student = optionalStudent.get();

		if (student.getLastEmailSentAt() != null) {

			LocalDateTime nextAllowedDate = student.getLastEmailSentAt().plusDays(3);

			if (LocalDateTime.now().isBefore(nextAllowedDate)) {

				System.out.println("🚫 Email blocked for 3 days: " + student.getEmail());

				return;
			}
		}

		String remark = remarksRepository.findLatestRemarkByEmail(student.getEmail());
		String finalRemark = remarksRepository.findLatestRemarkByEmail(student.getEmail());

		System.out.println("Remark found for: " + remark);
		System.out.println("Final Remark found for: " + finalRemark);

		if (remark == null || remark.trim().isEmpty()) {
			System.out.println("❌ No remark found for: " + student.getEmail());
			return;
		}

		try {
			// ✅ Step 2: Combine remarks for classification
			String combinedText = ((remark == null ? "" : remark) + " " + (finalRemark == null ? "" : finalRemark))
					.toLowerCase();

			System.out.println("📌 Remark: " + remark);
			System.out.println("📌 Final Remark: " + finalRemark);

			// 🚫 Step 3: Skip DEAD leads
			// 🚫 Step 3: Skip DEAD / DND leads BEFORE OpenAI call
			if (combinedText.contains("not interested") || combinedText.contains("no need")
					|| combinedText.contains("remove my number") || combinedText.contains("don't call")
					|| combinedText.contains("do not contact")) {

				System.out.println("🚫 DO NOT CONTACT: " + student.getEmail());
				return;
			}

			// ✅ Step 4: Generate AI Email (subject + body)
			Map<String, String> emailData = openAIService.generateEmail(student.getUserName(), student.getCourse_name(),
					remark, finalRemark);

			String subject = emailData.get("subject");
			String emailBody = emailData.get("body");

			String htmlBody = buildEmailTemplate(student.getUserName(), emailBody);

			// ✅ Step 5: Fallback safety
			if (subject == null || subject.trim().isEmpty()) {
				subject = "Quick Follow-up on " + student.getCourse_name();
			}

			if (emailBody == null || emailBody.trim().isEmpty()) {
				emailBody = "Hi " + student.getUserName() + ",\n\n" + "Following up regarding your interest in "
						+ student.getCourse_name() + ".\n\n" + "Thank you,\nTeam Hachion";
			}

			// ✅ Step 6: Add tracking ID
			String uniqueId = student.getStudentId() + "-" + System.currentTimeMillis();
//            subject = subject + " [" + uniqueId + "]";

			// 🔍 Step 7: Fetch coordinator email for CC
			String coordinatorName = remarksRepository.findLatestCoordinatorByEmail(student.getEmail());
			String ccEmail = null;

			if (coordinatorName != null && !coordinatorName.trim().isEmpty()) {
				Optional<Employee> empOpt = employeeRepository.findByNameIgnoreCase(coordinatorName.trim());
				if (empOpt.isPresent()) {
					ccEmail = empOpt.get().getEmail();
				}
			}

			// 📧 Step 8: Send email
//			emailService.sendDynamicEmailWithCC(student.getEmail(), ccEmail, subject, emailBody);
			emailService.sendDynamicEmailWithCC(student.getEmail(), ccEmail, subject, htmlBody);

			Integer count = student.getEmailSentCount();
			student.setEmailSentCount(count == null ? 1 : count + 1);

			student.setLastEmailSentAt(LocalDateTime.now());
			repository.save(student);

			System.out.println("✅ Email sent to: " + student.getEmail());
			System.out.println("📌 Subject: " + subject);
			System.out.println("📊 Total emails sent: " + student.getEmailSentCount());

		} catch (Exception e) {
			System.out.println("❌ Failed for: " + student.getEmail());
			e.printStackTrace();
		}
	}

	public void sendAutomationEmail(String studentId) {

		Optional<RegisterStudent> optionalStudent = repository.findByStudentId(studentId);

		if (!optionalStudent.isPresent()) {
			System.out.println("❌ Student not found");
			return;
		}

		RegisterStudent student = optionalStudent.get();

		String remark = remarksRepository.findLatestRemarkByEmail(student.getEmail());
		String finalRemark = remarksRepository.findLatestRemarkByEmail(student.getEmail());

		System.out.println("Remark found for: " + remark);
		System.out.println("Final Remark found for: " + finalRemark);

		if (remark == null || remark.trim().isEmpty()) {
			System.out.println("❌ No remark found for: " + student.getEmail());
			return;
		}

		try {
			// ✅ Step 2: Combine remarks for classification
			String combinedText = ((remark == null ? "" : remark) + " " + (finalRemark == null ? "" : finalRemark))
					.toLowerCase();

			System.out.println("📌 Remark: " + remark);
			System.out.println("📌 Final Remark: " + finalRemark);

			// 🚫 Step 3: Skip DEAD leads
			// 🚫 Step 3: Skip DEAD / DND leads BEFORE OpenAI call
			if (combinedText.contains("not interested") || combinedText.contains("no need")
					|| combinedText.contains("remove my number") || combinedText.contains("don't call")
					|| combinedText.contains("do not contact")) {

				System.out.println("🚫 DO NOT CONTACT: " + student.getEmail());
				return;
			}

			// ✅ Step 4: Generate AI Email (subject + body)
			Map<String, String> emailData = openAIService.generateEmail(student.getUserName(), student.getCourse_name(),
					remark, finalRemark);

			String subject = emailData.get("subject");
			String emailBody = emailData.get("body");

			String htmlBody = buildEmailTemplate(student.getUserName(), emailBody);

			// ✅ Step 5: Fallback safety
			if (subject == null || subject.trim().isEmpty()) {
				subject = "Quick Follow-up on " + student.getCourse_name();
			}

			if (emailBody == null || emailBody.trim().isEmpty()) {
				emailBody = "Hi " + student.getUserName() + ",\n\n" + "Following up regarding your interest in "
						+ student.getCourse_name() + ".\n\n" + "Thank you,\nTeam Hachion";
			}

			// ✅ Step 6: Add tracking ID
			String uniqueId = student.getStudentId() + "-" + System.currentTimeMillis();
//            subject = subject + " [" + uniqueId + "]";

			// 🔍 Step 7: Fetch coordinator email for CC
			String coordinatorName = remarksRepository.findLatestCoordinatorByEmail(student.getEmail());
			String ccEmail = null;

			if (coordinatorName != null && !coordinatorName.trim().isEmpty()) {
				Optional<Employee> empOpt = employeeRepository.findByNameIgnoreCase(coordinatorName.trim());
				if (empOpt.isPresent()) {
					ccEmail = empOpt.get().getEmail();
				}
			}

			// 📧 Step 8: Send email
//			emailService.sendDynamicEmailWithCC(student.getEmail(), ccEmail, subject, emailBody);
			emailService.sendDynamicEmailWithCC(student.getEmail(), ccEmail, subject, htmlBody);

			Integer count = student.getEmailSentCount();
			student.setEmailSentCount(count == null ? 1 : count + 1);

//			student.setLastEmailSentAt(LocalDateTime.now());
			repository.save(student);

			System.out.println("✅ Email sent to: " + student.getEmail());
			System.out.println("📌 Subject: " + subject);
			System.out.println("📊 Total emails sent: " + student.getEmailSentCount());

		} catch (Exception e) {
			System.out.println("❌ Failed for: " + student.getEmail());
			e.printStackTrace();
		}
	}

	private String buildEmailTemplate(String name, String dynamicContent) {

		String formattedContent = dynamicContent.replace("\n", "<br>");

		return "<html>" +
		// ✅ FULL WHITE BACKGROUND (no grey anywhere)
				"<body style='margin:0; padding:0; background:#ffffff; font-family: Arial, sans-serif;'>" +

				// ✅ ONE CLEAN BOX ONLY
//	            "<div style='max-width:700px; margin:0 auto; background:#ffffff;'>" +
				"<div style='max-width:700px; margin:0 auto; background:#ffffff; border:1px solid #eee; border-radius:8px;'>"
				+

				// HEADER
//	            "<div style='background:#1e4a8d; padding:20px; text-align:center;'>" +
				"<div style='background:#1e4a8d; padding:20px; text-align:center; border-top-left-radius:8px; border-top-right-radius:8px;'>"
				+ "<img src='https://www.hachion.co/logo.png' alt='Hachion' style='height:50px; display:block; margin:0 auto;'/>"
				+ "</div>" +

				// BODY
				"<div style='padding:25px; color:#333; font-size:16px; line-height:1.6;'>" + formattedContent + "</div>"
				+

				// FOOTER (NOW INSIDE SAME WHITE BOX)
				"<div style='padding:20px; text-align:center; border-top:1px solid #eee;'>" +

				"<div style='font-size:16px; font-weight:bold; margin-bottom:10px;'>Hachion Support Team</div>" +

				"<div style='margin:6px 0;'>"
				+ "<img src='https://img.icons8.com/color/16/whatsapp.png' style='vertical-align:middle; margin-right:6px;'> "
				+
//	            "<a href='https://wa.me/17324852499' style='color:#25D366; text-decoration:none;'>Chat with us on WhatsApp</a>" +
				"<a href='https://wa.me/17324852499' style='color:#1a73e8; text-decoration:none;'>Chat with us on WhatsApp</a>"
				+ "</div>" +

				"<div style='margin:6px 0;'>"
				+ "<img src='https://img.icons8.com/color/16/phone.png' style='vertical-align:middle; margin-right:6px;'> "
				+ "+1 (469) 639-0198" + "</div>" +

				"<div style='margin:6px 0;'>"
				+ "<img src='https://img.icons8.com/color/16/email.png' style='vertical-align:middle; margin-right:6px;'> "
				+ "trainings@hachion.co" + "</div>" +

				"<hr style='border:none; border-top:1px solid #ddd; margin:15px auto; width:80%;'>" +

				"<div style='font-size:13px; color:#666;'>Don’t want to receive emails? "
				+ "<a href='https://www.hachion.co/unsubscribe' style='color:#1a73e8;'>Unsubscribe</a></div>" +

//	            "<div style='margin-top:8px; font-size:12px; color:#888;'>© 2026 Hachion Technologies</div>" +
				"<div style='margin-top:8px; font-size:12px; color:#888;'>© Hachion " + java.time.Year.now().getValue()
				+ ". " + "All Rights Reserved.</div>" +

				"</div></div></body></html>";
	}

	// 🔁 Scheduled reply check
//	@Scheduled(cron = "0 0 10 * * *") // every day at 10 AM
//	@Scheduled(cron = "0 */2 * * * *") // every 2 minutes
	@Scheduled(cron = "0 0 6,18 * * *", zone = "Asia/Kolkata")

	public void checkEmailReplies() {
		System.out.println("🔄 Checking email replies...");
		emailReplyReaderService.readRepliesAndSendToChat();
	}
}