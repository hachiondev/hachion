package com.hachionUserDashboard.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hachionUserDashboard.entity.Enroll;
import com.hachionUserDashboard.entity.RegisterStudent;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

@Service
public class WebhookSenderService {

	private final RestTemplate restTemplate = new RestTemplate();

	private static final String WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQAIuBdqEw/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=PgRWqYKF7NEeEAZzBWqT1iCcinleNzcwjmE4Gi0loSw";

	private static final String ENROLLMENT_WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQA6CtmcJ8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=CY0FxmSRHqVno7JliDA5kr-uOqA4vxcVRaTwLKOPwz4";

	public void sendRegistrationDetails(RegisterStudent student) {
		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

		String message = String.format(
				"📢 *New Student Registered!*\n\n*User Name:* %s\n*Email:* %s\n*Mobile:* %s\n*Country:* %s\n*Registration Date:* %s",
				student.getUserName(), student.getEmail(), student.getMobile(), student.getCountry(),
				student.getDate().format(formatter));

		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON);

		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";

		HttpEntity<String> entity = new HttpEntity<>(payload, headers);

		try {
			restTemplate.postForEntity(WEBHOOK_URL, entity, String.class);
			System.out.println("✅ Webhook sent successfully.");
		} catch (Exception e) {
			System.err.println("❌ Failed to send webhook: " + e.getMessage());
		}
	}

//	public void sendEnrollmentDetails(Enroll enroll) {
//		DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");
//
//		String message = String
//				.format("🎓 *New Enrollment Received!*\n\n" + "*Name:* %s\n" + "*Email:* %s\n" + "*Course:* %s\n"
//						+ "*Course Schedule Date:* %s\n" + "*Mobile:* %s\n" + "*Mode:* %s\n" + "*Time:* %s\n" +
//						"*Batch ID:* %s\n" + "*Enroll Register Date:* %s", enroll.getName(), enroll.getEmail(), enroll.getCourse_name(),
//						enroll.getEnroll_date(), enroll.getMobile(), enroll.getMode(), enroll.getTime(),
//
//						enroll.getBatchId(), LocalDate.now().format(formatter));
//
//		HttpHeaders headers = new HttpHeaders();
//		headers.setContentType(MediaType.APPLICATION_JSON);
//
//		String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";
//
//		HttpEntity<String> entity = new HttpEntity<>(payload, headers);
//
//		try {
//			restTemplate.postForEntity(ENROLLMENT_WEBHOOK_URL, entity, String.class);
//			System.out.println("✅ Enrollment webhook sent successfully.");
//		} catch (Exception e) {
//			System.err.println("❌ Failed to send enrollment webhook: " + e.getMessage());
//		}
//	}
	
	public void sendEnrollmentDetails(Enroll enroll) {
	    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

	    // Format string date to dd-MM-yyyy
	    String formattedScheduleDate = "";
	    try {
	        LocalDate parsedDate = LocalDate.parse(enroll.getEnroll_date()); // from String
	        formattedScheduleDate = parsedDate.format(formatter);
	    } catch (Exception e) {
	        formattedScheduleDate = enroll.getEnroll_date(); // fallback
	    }

	    String message = String.format(
	        "🎓 *New Enrollment Received for %s!*\n\n" +
	        "*Name:* %s\n" +
	        "*Email:* %s\n" +
	        "*Course:* %s\n" +
	        "*Course Schedule Date:* %s\n" +
	        "*Mobile:* %s\n" +
	        "*Mode:* %s\n" +
	        "*Time:* %s\n" +
	        "*Batch ID:* %s\n" +
	        "*Enroll Register Date:* %s",
	        enroll.getMode(),
	        enroll.getName(),
	        enroll.getEmail(),
	        enroll.getCourse_name(),
	        formattedScheduleDate,
	        enroll.getMobile(),
	        enroll.getMode(),
	        enroll.getTime(),
	        enroll.getBatchId(),
	        LocalDate.now().format(formatter)
	    );

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
}