package com.hachionUserDashboard.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hachionUserDashboard.entity.Enroll;
import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.entity.RequestBatch;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

@Service
public class WebhookSenderService {

	private final RestTemplate restTemplate = new RestTemplate();

	private static final String REGISTER_WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQAIuBdqEw/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=PgRWqYKF7NEeEAZzBWqT1iCcinleNzcwjmE4Gi0loSw";

	private static final String ENROLLMENT_WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQA6CtmcJ8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=CY0FxmSRHqVno7JliDA5kr-uOqA4vxcVRaTwLKOPwz4";

	private static final String REQUEST_BATCH_WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQA6CtmcJ8/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=CY0FxmSRHqVno7JliDA5kr-uOqA4vxcVRaTwLKOPwz4";

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
			LocalDate parsedDate = LocalDate.parse(enroll.getEnroll_date()); // from String
			formattedScheduleDate = parsedDate.format(formatter);
		} catch (Exception e) {
			formattedScheduleDate = enroll.getEnroll_date(); // fallback
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
		        formattedScheduleDate = LocalDate.parse(requestBatch.getSchedule_date().substring(0, 10))
		                .format(formatter);
		    } catch (Exception e) {
		        formattedScheduleDate = requestBatch.getSchedule_date(); // fallback
		    }
		    
		String message = String.format(
				"📢 *Student Requesting for %s Schedule Change!*\n\n" + "*User Name:* %s\n" + "*Email:* %s\n"
						+ "*Mobile:* %s\n" + "*Country:* %s\n" + "*Preferred Mode:* %s\n" + "*Course:* %s\n"
						+ "*Schedule Date:* %s\n" + "*Time:* %s\n" + "*Requested On:* %s",
				requestBatch.getMode(), requestBatch.getUserName(), requestBatch.getEmail(), requestBatch.getMobile(),
				requestBatch.getCountry(), requestBatch.getMode(), requestBatch.getCourseName(),
				 formattedScheduleDate, requestBatch.getTime_zone(), requestBatch.getDate().format(formatter));

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
	
	private static final String WEBHOOK_URL = "https://chat.googleapis.com/v1/spaces/AAQA6ewjlUA/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=6Ky6FWJuoONB7vBZuwXqNsAb9uaT_Lkcegj5cF25_2c";

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
}