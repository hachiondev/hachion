package com.hachionUserDashboard.controller;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.LocalDate;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.TextStyle;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.entity.Enroll;
import com.hachionUserDashboard.repository.CourseScheduleRepository;
import com.hachionUserDashboard.repository.CurriculumRepository;
import com.hachionUserDashboard.repository.EnrollRepository;
import com.hachionUserDashboard.repository.PaymentTransactionRepository;
import com.hachionUserDashboard.repository.TrainerRepository;
import com.hachionUserDashboard.service.EmailService;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@CrossOrigin
@RestController
public class EnrollController {
	@Autowired
	private EnrollRepository repo;

	@Autowired
	private JavaMailSender javaMailSender;

	@Autowired
	private EmailService emailService;

	@Autowired
	private TrainerRepository trainerRepository;

	@Autowired
	private CourseScheduleRepository scheduleRepository;

	@Autowired
	private CurriculumRepository curriculumRepository;

	@Autowired
	private PaymentTransactionRepository paymentTransactionRepository;

	@GetMapping("/enroll/{id}")
	public ResponseEntity<Enroll> getEnroll(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/enroll")
	public List<Enroll> getAllEnroll() {
		return repo.findAll();
	}

	@PostMapping("/enroll/add")
	public ResponseEntity<?> addEnroll(@RequestBody Enroll requestEnroll)
			throws MessagingException, UnsupportedEncodingException {
		
		 int existingCount = repo.countByStudentCourseBatchAndModeLiveClass(
		            requestEnroll.getStudentId(),
		            requestEnroll.getCourse_name(),
		            requestEnroll.getBatchId());

		    if (existingCount > 0) {
		        return ResponseEntity.status(HttpStatus.CONFLICT)
		                .body("This enrollment record already exists for Live Class in the database.");
		    }
		
		
		Enroll enroll = new Enroll();
		enroll.setStudentId(requestEnroll.getStudentId());
		enroll.setName(requestEnroll.getName());
		enroll.setEmail(requestEnroll.getEmail());
		enroll.setCourse_name(requestEnroll.getCourse_name());
		enroll.setEnroll_date(requestEnroll.getEnroll_date());
		enroll.setMobile(requestEnroll.getMobile());
		enroll.setMode(requestEnroll.getMode());
		enroll.setTime(requestEnroll.getTime());
		enroll.setAmount(requestEnroll.getAmount());
		enroll.setTrainer(requestEnroll.getTrainer());
		enroll.setMeeting_link(requestEnroll.getMeeting_link());
		enroll.setBatchId(requestEnroll.getBatchId());

		LocalDate date = LocalDate.parse(requestEnroll.getEnroll_date());
		String dayOfWeek = date.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
		String formattedDate = date.format(DateTimeFormatter.ofPattern("dd-MMMM-yyyy"));

		String time = requestEnroll.getTime();

		String formattedDateTime = dayOfWeek + ", " + formattedDate + " at " + time;
		enroll.setWeek(dayOfWeek);

		// live class purpose added this logic starting point
		StringBuilder weekDaysBuilder = new StringBuilder();

		for (int i = 0; i < 3; i++) {
			LocalDate currentDay = date.plusDays(i);
			String dayName = currentDay.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
			weekDaysBuilder.append(dayName);
			if (i < 2) {
				weekDaysBuilder.append(", ");
			}
		}
		String weekDays = weekDaysBuilder.toString();
		// ending point

//		String trainerExperience = trainerRepository.findSummaryByTrainerName(requestEnroll.getTrainer());

		String trainerExperience = trainerRepository.findSummaryByTrainerNameAndCourse(requestEnroll.getTrainer(),
				requestEnroll.getCourse_name());

		String dateTimeStr = requestEnroll.getEnroll_date() + " " + requestEnroll.getTime();
		DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd h:mm a z", Locale.ENGLISH);
		ZonedDateTime zonedStart = ZonedDateTime.parse(dateTimeStr, inputFormatter);

		ZonedDateTime zonedEnd = zonedStart.plusMinutes(90);

		DateTimeFormatter calendarFormatter = DateTimeFormatter.ofPattern("yyyyMMdd'T'HHmmss'Z'")
				.withZone(ZoneOffset.UTC);

		String calendarLink = "https://www.google.com/calendar/render?action=TEMPLATE" + "&text="
				+ URLEncoder.encode(requestEnroll.getCourse_name() + " Live Demo", "UTF-8") + "&dates="
				+ calendarFormatter.format(zonedStart) + "/" + calendarFormatter.format(zonedEnd) + "&details="
				+ URLEncoder.encode("Join our live demo session with trainer " + requestEnroll.getTrainer()
						+ "!\n\nMeeting Link: " + requestEnroll.getMeeting_link(), "UTF-8")
				+ "&location=" + URLEncoder.encode("Online", "UTF-8") + "&sf=true&output=xml";

		String technologyName = requestEnroll.getCourse_name();

		String technologySlug = technologyName.toLowerCase().replaceAll("\\s+", "-").replaceAll("[^a-z0-9\\-]", "");

		if ("Live Demo".equalsIgnoreCase(requestEnroll.getMode())) {
			emailService.sendEmailForEnrollForLiveDemo(requestEnroll.getEmail(), requestEnroll.getCourse_name(),
					dayOfWeek, formattedDateTime, time, null, requestEnroll.getMeeting_link(), null, null,
					requestEnroll.getTrainer(), trainerExperience, null, null, null, null, null, null, calendarLink,
					technologySlug);
		}
		if ("Live Class".equalsIgnoreCase(requestEnroll.getMode())) {
			emailService.sendEmailForEnrollForLiveClass(requestEnroll.getEmail(), requestEnroll.getName(),
					requestEnroll.getCourse_name(), weekDays, formattedDate, time, null,
					requestEnroll.getMeeting_link(), null, null, requestEnroll.getTrainer(), trainerExperience, null,
					null, null, null, null, null, null, technologySlug);
		}

		repo.save(enroll);

		return ResponseEntity.ok("Enrollment successfull");
	}

	@PostMapping("/enroll/resend-email")
	public ResponseEntity<?> resendEnrollEmail(@RequestBody Map<String, String> request) throws MessagingException {
		String email = request.get("email");
		List<Enroll> enrollments = repo.findByEmail(email);

		if (enrollments.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No enrollment found for this email.");
		}

		Enroll latest = enrollments.get(enrollments.size() - 1); // assuming latest is last
		latest.setResendCount(latest.getResendCount() + 1); // Increment the counter

		repo.save(latest); // Save the updated resend count

//		sendEnrollEmail(latest); // Send the email

		LocalDate date = LocalDate.parse(latest.getEnroll_date());
		String dayOfWeek = date.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
		String formattedDate = date.format(DateTimeFormatter.ofPattern("dd-MMMM-yyyy"));

		String time = latest.getTime();

		String formattedDateTime = dayOfWeek + ", " + formattedDate + " at " + time + " " + " ()";
		latest.setWeek(dayOfWeek);

		String technologyName = latest.getCourse_name();

		String technologySlug = technologyName.toLowerCase().replaceAll("\\s+", "-").replaceAll("[^a-z0-9\\-]", "");

		emailService.sendEmailForEnrollForLiveDemo(latest.getEmail(), latest.getCourse_name(), dayOfWeek,
				formattedDateTime, time, null, latest.getMeeting_link(), null, null, latest.getTrainer(), null, null,
				null, null, null, null, null, null, technologySlug);

		return ResponseEntity.ok("Email resent successfully. Check your registered email.");
	}

	@DeleteMapping("enroll/delete/{id}")
	public ResponseEntity<?> deleteEnroll(@PathVariable int id) {
		Enroll enroll = repo.findById(id).get();
		repo.delete(enroll);
		return null;

	}

	@GetMapping("/enroll/coursenames")
	public ResponseEntity<List<String>> getAllCourseNames() {
		List<String> courseNames = repo.findAllCourseNames();
		return ResponseEntity.ok(courseNames);
	}

	public void sendEnrollEmail(@RequestBody Enroll enrollRequest) {
		try {
			MimeMessage message = javaMailSender.createMimeMessage();
			MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

			helper.setTo(enrollRequest.getEmail());
			helper.setSubject("Hachion - Free Demo Session Invitation");

			String htmlContent = "<div style='font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;background-color:#f9f9f9;'>"
					+ "  <div style='text-align:center;'>" + "    <img src='cid:logoImage' alt='Logo' height='50'/>"
					+ "    <h3 style='margin-top:20px;'>Hi " + enrollRequest.getName() + ",</h3>"
					+ "    <p>Thank you for showing interest in our training program by clicking <strong>Enroll Now!</strong></p>"
					+ "    <p>We're excited to invite you to a <strong>Free Demo Session</strong> where you’ll get a complete overview of what we offer, how the training works, and how it can help you get hired – even if you're from a non-IT background!</p>"
					+ "  </div>"

					+ "  <div style='margin:30px 0;background-color:#30003F;color:#fff;padding:10px 0;text-align:center;font-weight:bold;'>"
					+ "    Trainings Details" + "  </div>"

					+ "  <table style='width:100%;margin-bottom:20px;'>" + "    <tr>"
					+ "      <td><strong>Training Mode:</strong> Online Live Class</td>"
					+ "      <td><strong>Date:</strong> " + enrollRequest.getEnroll_date() + "</td>" + "    </tr>"
					+ "    <tr>" + "      <td><strong>Course Name:</strong> " + enrollRequest.getCourse_name() + "</td>"
					+ "      <td><strong>Time:</strong> " + enrollRequest.getTime() + "</td>" + "    </tr>"
					+ "  </table>"

					+ "  <div style='text-align:center;margin:30px;'>" + "    <a href='"
					+ enrollRequest.getMeeting_link()
					+ "' style='display:inline-block;background-color:#333;color:white;padding:10px 30px;border-radius:25px;text-decoration:none;'>Meeting Link</a>"
					+ "  </div>"

					+ "  <div style='background-color:#30003F;color:#fff;padding:10px 0;text-align:center;font-weight:bold;'>"
					+ "    What to Expect:" + "  </div>"

					+ "  <table style='width:100%;text-align:center;margin-top:10px;'>" + "    <tr>"
					+ "      <td>Introduction to the course</td>" + "      <td>Overview of our program</td>"
					+ "      <td>Real-time project insights</td>" + "    </tr>" + "    <tr>"
					+ "      <td>Q&A to clarify your doubts</td>" + "      <td>Daily Class Recordings</td>"
					+ "      <td>Assignments</td>" + "    </tr>" + "  </table>"

					+ "  <p style='margin-top:30px;text-align:center;'>"
					+ "    If you have any questions before the session, feel free to reply to this email." + "  </p>"

					+ "  <p style='text-align:center;margin-top:40px;'>Regards,<br/><strong style='color:#30003F;'>Team Hachion</strong></p>"
					+ "</div>";

			helper.setText(htmlContent, true);
			ClassPathResource logoImage = new ClassPathResource("images/logo.png");
			helper.addInline("logoImage", logoImage);
			javaMailSender.send(message);

			// Support team email remains the same
			SimpleMailMessage supportMail = new SimpleMailMessage();
			supportMail.setTo("trainings@hachion.co");
			supportMail.setSubject("New Enrollment Notification");
			supportMail.setText("Dear Support Team,\n\n" + "The following user has requested a batch:\n" + "Name: "
					+ enrollRequest.getName() + "\n" + "Email: " + enrollRequest.getEmail() + "\n" + "Mobile: "
					+ enrollRequest.getMobile() + "\n" + "Batch Date: " + enrollRequest.getEnroll_date() + "\n"
					+ "Batch Time: " + enrollRequest.getTime() + "\n" + "Mode: " + enrollRequest.getMode() + "\n\n"
					+ "Please contact the user to assist them further.\n\n" + "Best Regards,\nSystem Notification");

			javaMailSender.send(supportMail);

		} catch (MessagingException e) {
			e.printStackTrace();
		}
	}

//	@GetMapping("/enroll/check")
//	public Map<String, Object> checkLiveClassEnrollment(@RequestParam String studentId,
//			@RequestParam String courseName) {
//
//		int count = repo.countLiveClassEnrollment(studentId, courseName);
//
//		Map<String, Object> response = new HashMap<>();
//		response.put("isEnrolled", count > 0);
//
//		return response;
//	}

//	@GetMapping("/enroll/check")
//	public Map<String, Object> checkLiveClassEnrollment(
//	        @RequestParam String studentId,
//	        @RequestParam String courseName,
//	        @RequestParam String batchId) {
//
//	    int count = repo.countLiveClassEnrollment(studentId, courseName, batchId);
//
//	    Map<String, Object> response = new HashMap<>();
//	    response.put("isEnrolled", count > 0);
//
//	    return response;
//	}

//	@GetMapping("/enroll/check")
//	public ResponseEntity<?> checkLiveClassEnrollment(
//	        @RequestParam String studentId,
//	        @RequestParam String courseName,
//	        @RequestParam String batchId) {
//
//	    Boolean isActive = scheduleRepository.findIsActiveByBatchId(batchId);
//
//	    if (isActive == null) {
//	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
//	                .body(Map.of("error", "Batch ID not found"));
//	    }
//
//	    if (!isActive) {
//	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//	                .body(Map.of("error", "This batch is no longer active"));
//	    }
//
//	    int count = repo.countLiveClassEnrollment(studentId, courseName, batchId);
//
//	    Map<String, Object> response = new HashMap<>();
//	    response.put("isEnrolled", count > 0);
//
//	    return ResponseEntity.ok(response);
//	}

//	@GetMapping("/enroll/check")
//	public ResponseEntity<?> checkLiveClassEnrollment(@RequestParam String studentId, @RequestParam String courseName,
//			@RequestParam String batchId, @RequestParam String assessmentFileName) {
//
//		Boolean isActive = scheduleRepository.findIsActiveByBatchId(batchId);
//		if (isActive == null) {
//			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("error", "Batch ID not found"));
//		}
//		if (!isActive) {
//			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
//					.body(Map.of("error", "This batch is no longer active"));
//		}
//		List<String> assessmentFiles = curriculumRepository.findAssessmentFileNamesByCourseName(courseName);
//		List<String> fileNamesOnly = assessmentFiles.stream()
//			    .map(path -> path.substring(path.lastIndexOf("/") + 1))
//			    .collect(Collectors.toList());
//		
//		int assessmentIndex = fileNamesOnly.indexOf(assessmentFileName);
//
//		if (assessmentIndex >= 3) {
//			boolean hasPaid = paymentTransactionRepository.hasPaidForCourse(studentId, courseName, batchId);
//			if (!hasPaid) {
//				return ResponseEntity.status(HttpStatus.FORBIDDEN)
//						.body(Map.of("error", "You must pay to access this assessment."));
//			}
//		}
//		return ResponseEntity.ok(Map.of("canDownload", true));
//	}
	@GetMapping("/enroll/check")
	public ResponseEntity<?> checkLiveClassEnrollment(
	        @RequestParam String studentId,
	        @RequestParam String courseName,
	        @RequestParam String batchId,
	        @RequestParam String assessmentFileName) {

	    Boolean isActive = scheduleRepository.findIsActiveByBatchId(batchId);
	    if (isActive == null) {
	        return ResponseEntity.status(HttpStatus.NOT_FOUND)
	                .body(Map.of("error", "Batch ID not found"));
	    }
	    if (!isActive) {
	        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
	                .body(Map.of("error", "This batch is no longer active"));
	    }

	    List<String> assessmentFiles = curriculumRepository.findAssessmentFileNamesByCourseName(courseName);
	    List<String> fileNamesOnly = assessmentFiles.stream()
	            .map(path -> path.substring(path.lastIndexOf("/") + 1))
	            .collect(Collectors.toList());

	    int assessmentIndex = fileNamesOnly.indexOf(assessmentFileName);

	    if (assessmentIndex >= 3) {
	        Double amount = paymentTransactionRepository.findAmountPaidForCourse(studentId, courseName, batchId);
	        if (amount == null || amount <= 0) {
	            return ResponseEntity.status(HttpStatus.FORBIDDEN)
	                    .body(Map.of("error", "You must pay to access this assessment."));
	        }
	    }

	    return ResponseEntity.ok(Map.of("canDownload", true));
	}

}
