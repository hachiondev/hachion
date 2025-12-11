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

import com.hachionUserDashboard.entity.Enroll;
import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.entity.RequestBatch;

@Service
public class WebhookSenderService {

	private final RestTemplate restTemplate = new RestTemplate();

	private static final String REGISTER_WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQAIuBdqEw/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=PgRWqYKF7NEeEAZzBWqT1iCcinleNzcwjmE4Gi0loSw";

	private static final String ENROLLMENT_WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQA6CtmcJ8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=CY0FxmSRHqVno7JliDA5kr-uOqA4vxcVRaTwLKOPwz4";

	private static final String REQUEST_BATCH_WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQA6CtmcJ8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=CY0FxmSRHqVno7JliDA5kr-uOqA4vxcVRaTwLKOPwz4";

	private static final String REMINDER_WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQA8ccVOlE/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=xlniHAkMsFirxdEnt45vibQWPuniiOxTCBJzZL9yImU";

	private static final String WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQA6ewjlUA/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=6Ky6FWJuoONB7vBZuwXqNsAb9uaT_Lkcegj5cF25_2c";

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
	    String fullTime = requestBatch.getTime_zone();     // e.g., "07:00 PM CST"
	    String[] parts = fullTime.split(" ");
	    String timeZoneOnly = parts[parts.length - 1];      // e.g., "CST"

	    String message = String.format(
	        "📢 *Student Requesting for %s Request Batch!*\n\n" +
	        "*User Name:* %s\n" +
	        "*Email:* %s\n" +
	        "*Mobile:* %s\n" +
	        "*Country:* %s\n" +
	        "*Preferred Mode:* %s\n" +
	        "*Course:* %s\n" +
	        "*Time Zone:* %s\n" +
	        "*Requested On:* %s",
	        requestBatch.getMode(),
	        requestBatch.getUserName(),
	        requestBatch.getEmail(),
	        requestBatch.getMobile(),
	        requestBatch.getCountry(),
	        requestBatch.getMode(),
	        requestBatch.getCourseName(),
	        timeZoneOnly,                                   // only CST / IST etc
	        requestBatch.getDate().format(formatter)
	    );

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
				.append("\n\n")
				.append("*************************");

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

}