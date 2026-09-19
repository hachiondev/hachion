package com.hachionUserDashboard.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.EnrollmentWebhookRequest;
import com.hachionUserDashboard.service.EnrollmentService;
import com.hachionUserDashboard.service.WebhookSenderService;

import jakarta.mail.MessagingException;

@RestController
@RequestMapping("/api/webhook")
public class EnrollmentWebhookController {

	@Autowired
	private EnrollmentService enrollmentService;
	@Autowired
	private WebhookSenderService webhookSenderService;

//	
//	
//	
//	@PostMapping("/enrollment")
//	public ResponseEntity<?> sendToChat(@RequestBody EnrollmentWebhookRequest request) {
//		
//		String message = """
//				📢 *New Enquiry Form From Popup*
//
//				👤 Name: %s
//				📧 Email: %s
//				📞 Phone: %s
//				🎓 Course: %s
//				📝 Remark: %s
//				⏰ Time: %s
//				""".formatted(request.getName(), request.getEmail(), request.getPhone(), request.getCourseName(),
//				request.getRemark(), request.getTimestamp());
//
//		
//		Map<String, String> payload = new HashMap<>();
//		payload.put("text", message);
//
//		try {
//			HttpHeaders headers = new HttpHeaders();
//			headers.setContentType(MediaType.APPLICATION_JSON);
//
//			HttpEntity<Map<String, String>> entity = new HttpEntity<>(payload, headers);
//
//			restTemplate.postForEntity(CHAT_WEBHOOK_URL, entity, String.class);
//
//			return ResponseEntity.ok(Map.of("status", "success", "message", "Sent to chat successfully"));
//
//		} catch (Exception e) {
//			e.printStackTrace();
//			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
//					.body(Map.of("status", "error", "message", "Failed to send to chat"));
//		}
//	}
	@PostMapping("/enrollment")
	public ResponseEntity<?> enrollment(@RequestBody EnrollmentWebhookRequest request) throws MessagingException {

		enrollmentService.saveEnrollmentForm(request);

		webhookSenderService.sendEnrollmentDetailsToChat(request);

		return ResponseEntity.ok("Enrollment submitted successfully");
	}
}