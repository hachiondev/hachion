package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hachionUserDashboard.dto.AskQueryWebhookRequest;
import com.hachionUserDashboard.dto.BlogInquiryRequest;
import com.hachionUserDashboard.dto.EnrollmentWebhookRequest;
import com.hachionUserDashboard.dto.TalkToOurAdvisorRequest;
import com.hachionUserDashboard.dto.UnsubscribeRequest;
import com.hachionUserDashboard.entity.Enroll;
import com.hachionUserDashboard.entity.FaqQuery;
import com.hachionUserDashboard.entity.InstructorApplication;
import com.hachionUserDashboard.entity.Payment;
import com.hachionUserDashboard.entity.PaymentTransaction;
import com.hachionUserDashboard.entity.Query;
import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.entity.RequestBatch;

@Service
public class WebhookSenderService {

	private final RestTemplate restTemplate = new RestTemplate();

	private static final String REGISTER_WEBHOOK_URL = System.getenv("GCHAT_WEBHOOK_URL");

	private static final String ENROLLMENT_WEBHOOK_URL = System.getenv("GCHAT_WEBHOOK_URL");

	private static final String REQUEST_BATCH_WEBHOOK_URL = System.getenv("GCHAT_WEBHOOK_URL");

	private static final String REMINDER_WEBHOOK_URL = System.getenv("GCHAT_WEBHOOK_URL");

	private static final String WEBHOOK_URL = System.getenv("GCHAT_WEBHOOK_URL");

	// Training leads
	private static final String ASK_A_QUERY = System.getenv("GCHAT_WEBHOOK_URL");

	// Business space
	private static final String REQUEST_INSTALLMENT_WEBHOOK_URL = System.getenv("GCHAT_WEBHOOK_URL");

	// Training leads
	private static final String CORPORTATE_TRAINIG = System.getenv("GCHAT_WEBHOOK_URL");

//	private static final String REMINDER_WEBHOOK_URL= System.getenv("GCHAT_WEBHOOK_URL");

	// Trainer Hunt
	private final String BECOME_INSTRUCTOR = System.getenv("GCHAT_WEBHOOK_URL");

	private final String BLOG_INQUIRY_FORM = System.getenv("GCHAT_WEBHOOK_URL");

	private final String UNSUBSCRIBE_FORM = System.getenv("GCHAT_WEBHOOK_URL");

	private static final String CHAT_WEBHOOK_URL = System.getenv("GCHAT_WEBHOOK_URL");

	public void sendRegistrationDetailsOnline(RegisterStudent student) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

		String message = String.format(
				"📢 *New Student Registered!-ONLINE*\n\n*User Name:* %s\n*Email:* %s\n*Mobile:* %s\n*Country:* %s\n*Registration Date:* %s",
				student.getUserName(), student.getEmail(), student.getMobile(), student.getCountry(),
				student.getDate().format(formatter));

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";

		HttpEntity<String> entity = new HttpEntity<>(payload, headers);

		try {
			restTemplate.postForEntity(REGISTER_WEBHOOK_URL, entity, String.class);
			System.out.println("✅ Webhook sent successfully.");
		} catch (Exception e) {
			System.err.println("❌ Failed to send webhook: " + e.getMessage());
		}
	}

	public void sendRegistrationDetailsOffline(RegisterStudent student) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

		String message = String.format(
				"📢 *New Student Registered!-OFFLINE*\n\n*User Name:* %s\n*Email:* %s\n*Mobile:* %s\n*Country:* %s\n*Registration Date:* %s",
				student.getUserName(), student.getEmail(), student.getMobile(), student.getCountry(),
				student.getDate().format(formatter));

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";

		HttpEntity<String> entity = new HttpEntity<>(payload, headers);

		try {
			restTemplate.postForEntity(REGISTER_WEBHOOK_URL, entity, String.class);
			System.out.println("✅ Webhook sent successfully.");
		} catch (Exception e) {
			System.err.println("❌ Failed to send webhook: " + e.getMessage());
		}
	}

	public void sendEnrollmentDetails(Enroll enroll) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

		String formattedScheduleDate = "";
		try {
			LocalDate parsedDate = LocalDate.parse(enroll.getEnroll_date());
			formattedScheduleDate = parsedDate.format(formatter);
		} catch (Exception e) {
			formattedScheduleDate = enroll.getEnroll_date();
		}

		String message = String.format(
				"🎓 *New Enrollment Received for %s!*\n\n" + "*Name:* %s\n" + "*Email:* %s\n" + "*Course:* %s\n"
						+ "*Course Schedule Date:* %s\n" + "*Mobile:* %s\n" + "*Mode:* %s\n" + "*Time:* %s\n"
						+ "*Batch ID:* %s\n" + "*Enroll Register Date:* %s",
				enroll.getMode(), enroll.getName(), enroll.getEmail(), enroll.getCourse_name(), formattedScheduleDate,
				enroll.getMobile(), enroll.getMode(), enroll.getTime(), enroll.getBatchId(),
				LocalDate.now().format(formatter));

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";
		HttpEntity<String> entity = new HttpEntity<>(payload, headers);

		try {
			restTemplate.postForEntity(ENROLLMENT_WEBHOOK_URL, entity, String.class);
			System.out.println("✅ Enrollment webhook sent successfully.");
		} catch (Exception e) {
			System.err.println("❌ Failed to send enrollment webhook: " + e.getMessage());
		}
	}

	public void sendRequestBatchDetails(RequestBatch requestBatch) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

		String formattedScheduleDate;
		try {
			formattedScheduleDate = LocalDate.parse(requestBatch.getSchedule_date().substring(0, 10)).format(formatter);
		} catch (Exception e) {
			formattedScheduleDate = requestBatch.getSchedule_date();
		}

		String message = String.format(
				"📢 *Student Requesting for %s Schedule Change!*\n\n" + "*User Name:* %s\n" + "*Email:* %s\n"
						+ "*Mobile:* %s\n" + "*Country:* %s\n" + "*Preferred Mode:* %s\n" + "*Course:* %s\n"
						+ "*Schedule Date:* %s\n" + "*Time:* %s\n" + "*Requested On:* %s",
				requestBatch.getMode(), requestBatch.getUserName(), requestBatch.getEmail(), requestBatch.getMobile(),
				requestBatch.getCountry(), requestBatch.getMode(), requestBatch.getCourseName(), formattedScheduleDate,
				requestBatch.getTime_zone(), requestBatch.getDate().format(formatter));

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";
		HttpEntity<String> entity = new HttpEntity<>(payload, headers);

		try {
			restTemplate.postForEntity(REQUEST_BATCH_WEBHOOK_URL, entity, String.class);
			System.out.println("✅ Request batch webhook sent successfully.");
		} catch (Exception e) {
			System.err.println("❌ Failed to send request batch webhook: " + e.getMessage());
		}
	}

	public void sendRequestBatchDetailsForCourse(RequestBatch requestBatch) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

		// Extract only timezone (last part)
		String fullTime = requestBatch.getTime_zone(); // e.g., "07:00 PM CST"
		String[] parts = fullTime.split(" ");
		String timeZoneOnly = parts[parts.length - 1]; // e.g., "CST"

		String message = String.format(
				"📢 *Student Requesting for %s Request Batch!*\n\n" + "*User Name:* %s\n" + "*Email:* %s\n"
						+ "*Mobile:* %s\n" + "*Country:* %s\n" + "*Preferred Mode:* %s\n" + "*Course:* %s\n"
						+ "*Time Zone:* %s\n" + "*Requested On:* %s",
				requestBatch.getMode(), requestBatch.getUserName(), requestBatch.getEmail(), requestBatch.getMobile(),
				requestBatch.getCountry(), requestBatch.getMode(), requestBatch.getCourseName(), timeZoneOnly, // only
																												// CST /
																												// IST
																												// etc
				requestBatch.getDate().format(formatter));

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";
		HttpEntity<String> entity = new HttpEntity<>(payload, headers);

		try {
			restTemplate.postForEntity(REQUEST_BATCH_WEBHOOK_URL, entity, String.class);
			System.out.println("✅ Request batch webhook sent successfully.");
		} catch (Exception e) {
			System.err.println("❌ Failed to send request batch webhook: " + e.getMessage());
		}
	}

	public void sendToWorkspace(String userMessage, String botResponse) {
		RestTemplate restTemplate = new RestTemplate();
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		Map<String, String> payload = new HashMap<>();
		payload.put("question", userMessage);
		payload.put("response", botResponse);

		HttpEntity<Map<String, String>> entity = new HttpEntity<>(payload, headers);
		try {
			restTemplate.postForObject(WEBHOOK_URL, entity, String.class);
		} catch (Exception e) {
			System.err.println("🚨 Failed to send message to webhook: " + e.getMessage());
		}
	}

//
//	public void sendPaymentReminder(String studentId, String studentName, String studentEmail, String mobile,
//			String courseName, String invoiceNumber, Double balancePay, Double totalAmount, LocalDate dueDate,
//			Double receivedPay, LocalDate payDate
//
//	) {
//		String safeStudentId = (studentId == null || studentId.isBlank()) ? "N/A" : studentId;
//		String safeStudentName = (studentName == null || studentName.isBlank()) ? "Student" : studentName;
//		String safeEmail = (studentEmail == null || studentEmail.isBlank()) ? "N/A" : studentEmail;
//		String safeMobile = (mobile == null || mobile.isBlank()) ? "N/A" : mobile;
//		String safeCourse = (courseName == null || courseName.isBlank()) ? "N/A" : courseName;
//		String safeInvoice = (invoiceNumber == null || invoiceNumber.isBlank()) ? "N/A" : invoiceNumber;
//
//		String safeBalance = String.format("%.2f", balancePay == null ? 0.0 : balancePay);
//		String safeTotal = String.format("%.2f", totalAmount == null ? 0.0 : totalAmount);
//
//		String safeReceived = (receivedPay == null) ? "N/A" : String.format("%.2f", receivedPay);
//
//		DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM d, yyyy");
//		String safeDueDate = (dueDate == null) ? "N/A" : dueDate.format(dateFormatter);
//		String safePayDate = (payDate == null) ? "N/A" : payDate.format(dateFormatter);
//
//		String trainers = "N/A";
//		String batchId = "N/A";
//		String batchTiming = "N/A";
//		String trainingCoordinator = "N/A";
//
//		StringBuilder sb = new StringBuilder().append("🔔 *Payment Due Reminder Sent:*\n\n").append("Student ID: ")
//				.append(safeStudentId).append("\n").append("Student Name: ").append(safeStudentName).append("\n")
//				.append("Email: ").append(safeEmail).append("\n").append("Mobile Number: ").append(safeMobile)
//				.append("\n").append("Course: ").append(safeCourse).append("\n").append("Trainers: ").append(trainers)
//				.append("\n").append("Batch ID: ").append(batchId).append("\n").append("Batch Timing: ")
//				.append(batchTiming).append("\n").append("Invoice: ").append(safeInvoice).append("\n")
//
//				.append("*Balance: $").append(safeBalance).append(" (Total: $").append(safeTotal).append(")*\n")
//				.append("Due Date: ").append(safeDueDate).append("\n").append("Last Payment: ").append(safeReceived)
//				.append("\n").append("Last Payment Date: ").append(safePayDate).append("\n")
//				.append("Training Coordinator: ").append(trainingCoordinator).append("\n\n")
//				.append("***************************************************************************************");
//
//		postText(REMINDER_WEBHOOK_URL, sb.toString());
//	}
//
	private void postText(String url, String message) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);
		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";
		HttpEntity<String> entity = new HttpEntity<>(payload, headers);
		try {
			restTemplate.postForEntity(url, entity, String.class);
			System.out.println("✅ Webhook sent successfully.");
		} catch (Exception e) {
			System.err.println("❌ Failed to send webhook: " + e.getMessage());
		}
	}

	public void sendPaymentReceivedOffline(String studentId, String studentName, String studentEmail, String mobile,
			String courseName, String invoiceNumber, Double totalAmount, Double receivedPayment, Double nextPayment,
			LocalDate nextPaymentDate, String trainers, String batchId, String batchTiming,
			String trainingCoordinator) {
		String safeStudentId = (studentId == null || studentId.isBlank()) ? "N/A" : studentId;
		String safeStudentName = (studentName == null || studentName.isBlank()) ? "Student" : studentName;
		String safeEmail = (studentEmail == null || studentEmail.isBlank()) ? "N/A" : studentEmail;
		String safeMobile = (mobile == null || mobile.isBlank()) ? "N/A" : mobile;
		String safeCourse = (courseName == null || courseName.isBlank()) ? "N/A" : courseName;
		String safeInvoice = (invoiceNumber == null || invoiceNumber.isBlank()) ? "N/A" : invoiceNumber;

		String safeReceivedPay = (receivedPayment == null) ? "N/A" : String.format("%.2f", receivedPayment);
		String safeNextPay = (nextPayment == null) ? "N/A" : String.format("%.2f", nextPayment);
		String safeTotal = String.format("%.2f", totalAmount == null ? 0.0 : totalAmount);

		DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM d, yyyy");
		String safeNextPayDate = (nextPaymentDate == null) ? "N/A" : nextPaymentDate.format(dateFormatter);

		String safeTrainers = (trainers == null || trainers.isBlank()) ? "N/A" : trainers;
		String safeBatchId = (batchId == null || batchId.isBlank()) ? "N/A" : batchId;
		String safeBatchTiming = (batchTiming == null || batchTiming.isBlank()) ? "N/A" : batchTiming;
		String safeCoordinator = (trainingCoordinator == null || trainingCoordinator.isBlank()) ? "N/A"
				: trainingCoordinator;

		StringBuilder sb = new StringBuilder().append("🔔 New Payment Received (Offline)\n\n").append("Student ID: ")
				.append(safeStudentId).append("\n").append("Student Name: ").append(safeStudentName).append("\n")
				.append("Email :").append(safeEmail).append("\n").append("Mobile Number: ").append(safeMobile)
				.append("\n").append("Course: ").append(safeCourse).append("\n").append("Trainers: ")
				.append(safeTrainers).append("\n").append("Batch ID: ").append(safeBatchId).append("\n")
				.append("Batch Timing: ").append(safeBatchTiming).append("\n").append("Invoice: ").append(safeInvoice)
				.append("\n").append("Received Payment: $").append(safeReceivedPay).append(" (Total  $")
				.append(safeTotal).append(")\n").append("Next Payment : $").append(safeNextPay).append("\n")
				.append("Next Payment Date: ").append(safeNextPayDate).append("\n").append("Training Coordinator: ")
				.append(safeCoordinator);

		postText(REMINDER_WEBHOOK_URL, sb.toString());
	}

	public void sendPaymentReminder(String studentId, String studentName, String studentEmail, String mobile,
			String courseName, String invoiceNumber, Double balancePay, Double totalAmount, LocalDate dueDate,
			Double receivedPay, LocalDate payDate) {

		ZoneId IST = ZoneId.of("Asia/Kolkata");
		LocalDate today = LocalDate.now(IST);
		String heading = resolveHeading(dueDate, today);

		String safeStudentId = (studentId == null || studentId.isBlank()) ? "N/A" : studentId;
		String safeStudentName = (studentName == null || studentName.isBlank()) ? "Student" : studentName;
		String safeEmail = (studentEmail == null || studentEmail.isBlank()) ? "N/A" : studentEmail;
		String safeMobile = (mobile == null || mobile.isBlank()) ? "N/A" : mobile;
		String safeCourse = (courseName == null || courseName.isBlank()) ? "N/A" : courseName;
		String safeInvoice = (invoiceNumber == null || invoiceNumber.isBlank()) ? "N/A" : invoiceNumber;

		String safeBalance = String.format("%.2f", balancePay == null ? 0.0 : balancePay);
		String safeTotal = String.format("%.2f", totalAmount == null ? 0.0 : totalAmount);
		String safeReceived = (receivedPay == null) ? "N/A" : String.format("%.2f", receivedPay);

		DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("MMM d, yyyy");
		String safeDueDate = (dueDate == null) ? "N/A" : dueDate.format(dateFormatter);
		String safePayDate = (payDate == null) ? "N/A" : payDate.format(dateFormatter);

		String trainers = "N/A";
		String batchId = "N/A";
		String batchTiming = "N/A";
		String trainingCoordinator = "N/A";

		StringBuilder sb = new StringBuilder().append(heading).append("\n\n") // <-- dynamic heading
				.append("Student ID: ").append(safeStudentId).append("\n").append("Student Name: ")
				.append(safeStudentName).append("\n").append("Email: ").append(safeEmail).append("\n")
				.append("Mobile Number: ").append(safeMobile).append("\n").append("Course: ").append(safeCourse)
				.append("\n").append("Trainers: ").append(trainers).append("\n").append("Batch ID: ").append(batchId)
				.append("\n").append("Batch Timing: ").append(batchTiming).append("\n").append("Invoice: ")
				.append(safeInvoice).append("\n").append("*Balance: $").append(safeBalance).append(" (Total: $")
				.append(safeTotal).append(")*\n").append("Due Date: ").append(safeDueDate).append("\n")
				.append("Last Payment: ").append(safeReceived).append("\n").append("Last Payment Date: ")
				.append(safePayDate).append("\n").append("Training Coordinator: ").append(trainingCoordinator)
				.append("\n\n").append("*************************");

		postText(REMINDER_WEBHOOK_URL, sb.toString());
	}

	private String resolveHeading(LocalDate dueDate, LocalDate today) {
		if (dueDate == null)
			return "🔔 Payment Reminder";
		long delta = java.time.temporal.ChronoUnit.DAYS.between(dueDate, today);

		if (delta == -2)
			return "🔔 *Upcoming Payment Reminder (D-2)*";
		if (delta == 0)
			return "🔔 *Payment Due Today (D+0)*";
		if (delta > 0 && delta <= 6 && delta % 2 == 0)
			return "🔔 *Overdue Reminder (D+" + delta + ")*";
		if (delta >= 13 && ((delta - 13) % 7 == 0))
			return "🔔 *Weekly Overdue Reminder (D+" + delta + ")*";
		if (delta > 0)
			return "🔔 *Overdue (D+" + delta + ")*";
		return "🔔 Payment Reminder";
	}

	public void sendToWebhook(AskQueryWebhookRequest req) {

		RestTemplate restTemplate = new RestTemplate();

		// Build message text exactly like you want
		String messageText = "📩 *Lead enquiry from Ask a Query form:*\n\n" + "*Email:* " + safe(req.getEmail()) + "\n"
				+ "*Phone:* " + safe(req.getPhone()) + "\n" + "*Comments:* " + safe(req.getComments()) + "\n"
				+ "*Location:* " + safe(req.getLocation());

		// Google Chat expects: { "text": "message" }
		Map<String, String> payload = new HashMap<>();
		payload.put("text", messageText);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<Map<String, String>> entity = new HttpEntity<>(payload, headers);

		restTemplate.postForEntity(ASK_A_QUERY, entity, String.class);
	}

	private String safe(String v) {
		return (v == null || v.isBlank()) ? "N/A" : v;
	}

	public void sendInstallmentRequestDetails(PaymentTransaction transaction) {

		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

		String formattedDate = transaction.getRequestDate() != null ? transaction.getRequestDate().format(formatter)
				: "N/A";

		String message = String.format(
				"💳 *New Installment Enquiry Received!*\n\n" + "*Name:* %s\n" + "*Email:* %s\n"
						+ "*Installments Requested:* %s\n" + "*Course:* %s\n" + "*Request Date:* %s",
				transaction.getStudentName(), transaction.getPayerEmail(), transaction.getNumSelectedInstallments(),
				transaction.getCourseName(), formattedDate);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";

		HttpEntity<String> entity = new HttpEntity<>(payload, headers);

		try {
			restTemplate.postForEntity(REQUEST_INSTALLMENT_WEBHOOK_URL, entity, String.class);
			System.out.println("✅ Installment webhook sent successfully.");
		} catch (Exception e) {
			System.err.println("❌ Failed to send installment webhook: " + e.getMessage());
		}
	}

	public void sendCorporateTrainingLead(TalkToOurAdvisorRequest request) {

		String message = String.format(
				"🏢 *New Lead – Corporate Training*\n\n" + "🏢 *Company:* %s\n" + "👤 *Name:* %s\n" + "📧 *Email:* %s\n"
						+ "📞 *Mobile:* %s\n" + "📘 *Course:* %s\n" + "💬 *Comment:* %s",
				request.getCompanyName(), request.getFullName(), request.getEmailId(), request.getMobileNumber(),
				request.getTrainingCourse(), request.getComments());

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";

		HttpEntity<String> entity = new HttpEntity<>(payload, headers);

		try {
			restTemplate.postForEntity(CORPORTATE_TRAINIG, entity, String.class);
			System.out.println("✅ Corporate Training Lead webhook sent successfully.");
		} catch (Exception e) {
			System.err.println("❌ Failed to send Corporate Training Lead webhook: " + e.getMessage());
		}
	}

	public void sendContactUsLead(Query query) {

		String message = String.format(
				"📩 *Someone trying to reach thru – Contact Us Form*\n\n" + "👤 *Name:* %s\n" + "📧 *Email:* %s\n"
						+ "📞 *Mobile:* %s\n" + "💬 *Comment:* %s",
				safe(query.getName()), safe(query.getEmail()), safe(query.getMobile()), safe(query.getComment()));

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";

		HttpEntity<String> entity = new HttpEntity<>(payload, headers);

		try {
			restTemplate.postForEntity(CORPORTATE_TRAINIG, entity, String.class); // or CONTACT_US webhook URL
			System.out.println("✅ Contact Us Lead webhook sent successfully.");
		} catch (Exception e) {
			System.err.println("❌ Failed to send Contact Us Lead webhook: " + e.getMessage());
		}
	}

	public void sendFaqAskQuestionLead(FaqQuery faqQuery) {

		String message = String.format(
				"❓ *New Question from – FAQ Ask a Question form*\n\n" + "👤 *Name:* %s\n" + "📧 *Email:* %s\n"
						+ "💬 *Comment:* %s",
				safe(faqQuery.getName()), safe(faqQuery.getEmailId()), safe(faqQuery.getMessage()));

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";

		HttpEntity<String> entity = new HttpEntity<>(payload, headers);

		try {
			restTemplate.postForEntity(CORPORTATE_TRAINIG, entity, String.class); // or a dedicated FAQ webhook URL
			System.out.println("✅ FAQ Ask a Question webhook sent successfully.");
		} catch (Exception e) {
			System.err.println("❌ Failed to send FAQ Ask a Question webhook: " + e.getMessage());
		}
	}

	public void sendStopReminderNotification(Payment payment) {

		String message = String.format(
				"🔕 *Stop Reminder Requested – Payment Update*\n\n" + "👤 *Name:* %s\n" + "📧 *Email:* %s\n"
						+ "🆔 *Student ID:* %s\n" + "📞 *Mobile:* %s\n" + "📘 *Course:* %s\n" + "💰 *Balance Pay:* %s\n"
						+ "⛔ *Stop Reminder:* %s",
				safe(payment.getStudentName()), safe(payment.getEmail()), safe(payment.getStudentId()),
				safe(payment.getMobile()), safe(payment.getCourseName()),
				payment.getBalancePay() != null ? payment.getBalancePay().toString() : "N/A",
				safe(payment.getStopReminder()));

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";

		HttpEntity<String> entity = new HttpEntity<>(payload, headers);

		try {
			restTemplate.postForEntity(REMINDER_WEBHOOK_URL, entity, String.class); // or a dedicated STOP REMINDER
																					// webhook
			System.out.println("✅ Stop Reminder notification sent to chat.");
		} catch (Exception e) {
			System.err.println("❌ Failed to send Stop Reminder notification: " + e.getMessage());
		}
	}

	public void sendInstructorApplication(InstructorApplication app) {

		String currentDate = java.time.LocalDate.now()
				.format(java.time.format.DateTimeFormatter.ofPattern("MMM-dd-yyyy"));

		String message = String.format(
				"*📢 New Instructor Application*\n\n" + "*Date:* %s\n" + "*Name:* %s\n" + "*Email:* %s\n"
						+ "*Mobile:* %s\n" + "*Location:* %s\n" + "*Skills:* %s\n" + "*Area:* %s\n"
						+ "*Experience:* %s\n" + "*Mode:* %s\n" + "*Portfolio Link:* %s\n" + "*Comment:* %s",
				currentDate, app.getName(), app.getEmail(), app.getMobile(), app.getLocation(), app.getSkill(),
				app.getArea(), app.getExperience(), app.getMode(), app.getLink(), app.getComment());

		Map<String, String> payload = new HashMap<>();
		payload.put("text", message);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<Map<String, String>> request = new HttpEntity<>(payload, headers);

		restTemplate.postForEntity(BECOME_INSTRUCTOR, request, String.class);
	}

	public void sendToBlogInquiryForm(BlogInquiryRequest request) {

		RestTemplate restTemplate = new RestTemplate();

		String message = "🚀 *New Blog Inquiry*\n\n" + "*Name:* " + request.getName() + "\n" + "*Email:* "
				+ request.getEmail() + "\n" + "*Phone:* " + request.getPhone() + "\n" + "*Course:* "
				+ request.getBlogTitle() + "\n" + "*Query:* "
				+ (request.getQuery() != null ? request.getQuery() : "N/A") + "\n" + "*Time:* "
				+ request.getTimestamp();

		Map<String, String> body = new HashMap<>();
		body.put("text", message);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

		restTemplate.postForEntity(BLOG_INQUIRY_FORM, entity, String.class);
	}

	public void sendGoogleFormRegistrationDetails(RegisterStudent student, boolean isDuplicate) {

		String heading = isDuplicate ? "⚠️ *Duplicate Lead from %s!*" : "📢 *New Lead from %s!*";

		String message = String.format(
				heading + "\n\n" + "*Email:* %s\n" + "*Name:* %s\n" + "*Phone:* %s\n" + "*WhatsApp:* %s\n"
						+ "*Course:* %s\n" + "*Country:* %s\n" + "*State:* %s",

				student.getSeoTeam() != null ? student.getSeoTeam() : "Unknown",

				student.getEmail(), student.getUserName(), student.getMobile(), student.getWhatsapp(),
				student.getCourse_name(), student.getCountry() != null ? student.getCountry() : "N/A",
				student.getStateCity() != null ? student.getStateCity() : "N/A");

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";

		HttpEntity<String> entity = new HttpEntity<>(payload, headers);

		try {
			restTemplate.postForEntity(ASK_A_QUERY, entity, String.class);
			System.out.println("✅ Webhook sent successfully.");
		} catch (Exception e) {
			System.err.println("❌ Failed to send webhook: " + e.getMessage());
		}
	}

	public void sendUnsubscribeNotification(UnsubscribeRequest request) {

		try {

			RestTemplate restTemplate = new RestTemplate();

			String message = "🚫 Hachion Unsubscribe Alert\n\n" +

					"👤 Name: " + request.getUserName() + "\n" + "📧 Email: " + request.getEmail() + "\n"
					+ "📱 Mobile: " + request.getMobile() + "\n" + "🌍 Country: " + request.getCountry() + "\n"
					+ "📝 Reason: " + request.getReason() + "\n" + "💬 Comments: " + request.getComments() + "\n"
					+ "📅 Date: " + LocalDate.now().format(DateTimeFormatter.ofPattern("MMM-dd-yyyy"));

			Map<String, String> body = new HashMap<>();
			body.put("text", message);

			HttpHeaders headers = new HttpHeaders();
			headers.setContentType(MediaType.APPLICATION_JSON);

			HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);

			restTemplate.postForEntity(UNSUBSCRIBE_FORM, entity, String.class);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	public void sendEnrollmentDetailsToChat(EnrollmentWebhookRequest request) {

		String message = """
				📢 *New Enquiry Form From Popup*

				👤 Name: %s
				📧 Email: %s
				📞 Phone: %s
				🎓 Course: %s
				⏰ Time: %s
				""".formatted(request.getName(), request.getEmail(), request.getPhone(), request.getCourseName(),
				 request.getTimestamp());

		Map<String, String> payload = new HashMap<>();
		payload.put("text", message);

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		HttpEntity<Map<String, String>> entity = new HttpEntity<>(payload, headers);

		restTemplate.postForEntity(CHAT_WEBHOOK_URL, entity, String.class);
	}
}
