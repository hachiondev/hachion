package com.hachionUserDashboard.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.entity.RequestBatch;
import com.hachionUserDashboard.repository.CourseRepository;
import com.hachionUserDashboard.repository.RequestBatchRepository;
import com.hachionUserDashboard.service.WebhookSenderService;
import com.hachionUserDashboard.service.WhatsAppService;

import jakarta.mail.internet.MimeMessage;

@CrossOrigin

@RestController
public class RequestBatchController {

	@Autowired
	private RequestBatchRepository repo;
	@Autowired
	public JavaMailSender javaMailSender;

	@Autowired
	private WebhookSenderService webhookSenderService;

	@Autowired
	private CourseRepository courseRepository;

	@Autowired
	public WhatsAppService whatsAppService;

	@GetMapping("/requestbatch/{id}")
	public ResponseEntity<RequestBatch> getRequestBatch(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/requestbatch")
	public List<RequestBatch> getAllRequestBatch() {
		return repo.findAll();
	}

	@PostMapping("/requestbatch/add")
	public ResponseEntity<?> addRequestBatch(@RequestBody RequestBatch requestBatchRequest) {
		// Handle adding the request batch, including userName
		RequestBatch requestBatch = new RequestBatch();
		requestBatch.setSchedule_date(requestBatchRequest.getSchedule_date());
		requestBatch.setTime_zone(requestBatchRequest.getTime_zone());
		requestBatch.setEmail(requestBatchRequest.getEmail());
		requestBatch.setMobile(requestBatchRequest.getMobile());
		requestBatch.setMode(requestBatchRequest.getMode());
		requestBatch.setCountry(requestBatchRequest.getCountry());
		requestBatch.setCourseName(requestBatchRequest.getCourseName());
		requestBatch.setUserName(requestBatchRequest.getUserName());
		requestBatch.setDate(LocalDate.now());
		requestBatch.setTrainerName(requestBatchRequest.getTrainerName());

		sendRequestEmail(requestBatch);
		repo.save(requestBatch);
		webhookSenderService.sendRequestBatchDetails(requestBatch);

		return ResponseEntity.ok("Request batch added successfully");
	}

//	@PostMapping("/requestbatch/course/add")
//	public ResponseEntity<?> addRequestBatchForCourse(@RequestBody RequestBatch requestBatchRequest) {
//		// Handle adding the request batch, including userName
//		RequestBatch requestBatch = new RequestBatch();
//		requestBatch.setTime_zone(requestBatchRequest.getTime_zone());
//		requestBatch.setEmail(requestBatchRequest.getEmail());
//		requestBatch.setMobile(requestBatchRequest.getMobile());
//		requestBatch.setMode(requestBatchRequest.getMode());
//		requestBatch.setCountry(requestBatchRequest.getCountry());
//		requestBatch.setCourseName(requestBatchRequest.getCourseName());
//		requestBatch.setUserName(requestBatchRequest.getUserName());
//		requestBatch.setDate(LocalDate.now());
//		requestBatch.setPreferredTime(requestBatchRequest.getPreferredTime());
//		requestBatch.setNotification(requestBatchRequest.getNotification());
//		requestBatch.setPreferredDay(requestBatchRequest.getPreferredDay());
//
//		if(requestBatch.getNotification()!=null) {
////			sendRequestEmail(requestBatch);
//		}
//		repo.save(requestBatch);
////		webhookSenderService.sendRequestBatchDetailsForCourse(requestBatch);
//
//		return ResponseEntity.ok("Request batch added successfully");
//	}
	@PostMapping("/requestbatch/course/add")
	public ResponseEntity<?> addRequestBatchForCourse(@RequestBody RequestBatch requestBatchRequest) {

		RequestBatch requestBatch = new RequestBatch();
		requestBatch.setTime_zone(requestBatchRequest.getTime_zone());
		requestBatch.setEmail(requestBatchRequest.getEmail());
		requestBatch.setMobile(requestBatchRequest.getMobile());
		requestBatch.setMode(requestBatchRequest.getMode());
		requestBatch.setCountry(requestBatchRequest.getCountry());
		requestBatch.setCourseName(requestBatchRequest.getCourseName());
		requestBatch.setUserName(requestBatchRequest.getUserName());
		requestBatch.setDate(LocalDate.now());
		requestBatch.setPreferredTime(requestBatchRequest.getPreferredTime());
		requestBatch.setNotification(requestBatchRequest.getNotification());
		requestBatch.setPreferredDay(requestBatchRequest.getPreferredDay());
		requestBatch.setTrainerName(requestBatchRequest.getTrainerName());

		// Save batch request FIRST (recommended)
		repo.save(requestBatch);
		webhookSenderService.sendRequestBatchDetailsForCourse(requestBatch);
		String notify = requestBatch.getNotification();

		if (notify != null) {

			notify = notify.trim().toLowerCase();

			if (notify.contains("whatsapp")) {

				whatsAppService.sendEnrollmentConfirmedUtility(requestBatch);
				System.out.println("WhatsApp notification triggered for: " + notify);
			}

			if (notify.contains("email")) {

				sendRequestEmail(requestBatch);
				System.out.println("Email notification triggered for: " + notify);
			}
		}

		return ResponseEntity.ok("Request batch added successfully");
	}

	public void sendRequestEmail(RequestBatch requestBatchRequest) {
		try {
			MimeMessage mimeMessage = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

			helper.setTo(requestBatchRequest.getEmail());
			helper.setSubject("🎉 Welcome to Your " + requestBatchRequest.getCourseName() + " Mentoring Program!");

			String userName = safe(requestBatchRequest.getUserName(), "Student");
			String courseName = safe(requestBatchRequest.getCourseName(), "Your Course");
			String mode = safe(requestBatchRequest.getMode(), "Mentoring (Instructor-Guided)");
			String startDate = LocalDate.now().format(DateTimeFormatter.ofPattern("dd MMMM yyyy"));

			String duration = "TBD";
			if (requestBatchRequest.getCourseName() != null && !requestBatchRequest.getCourseName().isBlank()) {
				duration = courseRepository.findNumberOfClassesByCourseName(requestBatchRequest.getCourseName())
						.orElse("TBD");
			}

			String platformUrl = "https://hachion.co";

			String html = "<div style='font-family: Arial, sans-serif; line-height: 1.6; color: #000;'>"
					+ "<h2>🎉 Welcome to Your " + courseName + " Mentoring Program! 🎉</h2>"
					+ "<p>Your guided journey to becoming a <b>" + courseName + "</b> professional starts now.</p>"

					+ "<p>✅ <b>Enrollment Confirmed!</b></p>"

					+ "<p>Hi <b>" + userName + "</b>,</p>"

					+ "<p>We’re excited to welcome you to the <b>" + courseName
					+ " Professional Program (Mentoring Mode)</b>. "
					+ "You now have access to mentor-led, structured learning, designed to provide personalized guidance "
					+ "and hands-on support throughout your journey.</p>"

					+ "<h3>Your Mentoring Experience</h3>" + "<p>As part of the mentoring program, you will:</p>"
					+ "<ul>" + "<li>Receive expert guidance from an assigned mentor</li>"
					+ "<li>Attend scheduled mentoring and doubt-resolution sessions</li>"
					+ "<li>Follow a structured, goal-oriented curriculum</li>"
					+ "<li>Get personalized feedback and career guidance</li>"
					+ "<li>Learn with accountability and continuous support</li>" + "</ul>"

					+ "<p>🕒 You’ll have access to learning resources along with mentor support as per your enrollment plan.</p>"

					+ "<h3>📅 Program Details</h3>" + "<p><b>Learning Mode:</b> " + mode + "<br/>"
					+ "<b>Mentoring Start Date:</b> " + startDate + "<br/>" + "<b>Program Duration:</b> " + duration
					+ " (Recommended timeline)<br/>" + "<b>Progress:</b> Guided learning with mentor support</p>"

					+ "<h3>🔗 Access Details</h3>" + "<p><b>Learning Platform:</b> Online Learning Portal<br/>"
					+ "<b>Login Access:</b> <a href='" + platformUrl + "'>Click to Access Your Course</a><br/>"
					+ "<b>Availability:</b> 24/7 learning resources + scheduled mentor sessions</p>"

					+ "<p>👉 <b>Start your mentoring journey today and move ahead with confidence!</b></p>"

					+ "<p>We recommend actively engaging with your mentor and following the suggested plan to get the best results from the program.</p>"

					+ "<br/>" + "<p>Best regards,<br/>" + "<b>Hachion Platform Notification System</b><br/>"
					+ "Online Training | Career-Focused Learning</p>"

					+ "<p>🌐 <a href='" + platformUrl + "'>" + platformUrl + "</a></p>" + "</div>";

			helper.setText(html, true); // true = HTML email

			// Send student email
			javaMailSender.send(mimeMessage);

			// ---- Support Mail (can stay simple or also HTML) ----
			SimpleMailMessage supportMail = new SimpleMailMessage();
			supportMail.setTo("monikarathore.cs@gmail.com");
			supportMail.setSubject("New Mentoring Enrollment: " + userName);
			supportMail.setText("Dear Support Team,\n\n" + "A new student has enrolled in mentoring mode:\n\n"
					+ "Name: " + userName + "\n" + "Email: " + requestBatchRequest.getEmail() + "\n" + "Mobile: "
					+ requestBatchRequest.getMobile() + "\n" + "Course: " + courseName + "\n" + "Mode: " + mode + "\n"
					+ "Start Date: " + startDate + "\n\n" + "Please follow up with the student if needed.\n\n"
					+ "Best Regards,\nHachion System");

			javaMailSender.send(supportMail);

		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	private String safe(String value, String fallback) {
		return (value == null || value.trim().isEmpty()) ? fallback : value;
	}

	@DeleteMapping("requestbatch/delete/{id}")
	public ResponseEntity<?> deleteRequestBatch(@PathVariable int id) {
		RequestBatch requestbatch = repo.findById(id).get();
		repo.delete(requestbatch);
		return null;

	}
}