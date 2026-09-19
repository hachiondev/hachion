package com.hachionUserDashboard.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.cronjobs.EmailCronService;
import com.hachionUserDashboard.dto.EnquiryRequest;
import com.hachionUserDashboard.dto.EnquiryResponse;
import com.hachionUserDashboard.dto.ImportResponse;
import com.hachionUserDashboard.dto.LeadDashboardDTO;
import com.hachionUserDashboard.dto.RegisterStudentResponseDTO;
import com.hachionUserDashboard.dto.StudentRemarkRequest;
import com.hachionUserDashboard.dto.StudentRemarkResponse;
import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.entity.StudentRemarksHistory;
import com.hachionUserDashboard.repository.EmailAutomationRuleRepository;
import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.hachionUserDashboard.service.EmailService;
import com.hachionUserDashboard.service.RegisterStudentService;
import com.hachionUserDashboard.service.WebhookSenderService;

import jakarta.mail.MessagingException;

@CrossOrigin
@RestController
public class RegisterStudentController {

	@Autowired
	private RegisterStudentRepository repo;

	@Autowired
	private PasswordEncoder passwordEncoder;

	@Autowired
	private EmailService emailService;

	@Autowired
	private RegisterStudentService service;

	@Autowired
	private EmailCronService emailCronService;
	
	@Autowired
	private EmailAutomationRuleRepository automationRuleRepository;
	
	@Autowired
	private WebhookSenderService webhookSenderService;

	@GetMapping("/registerstudent/{id}")
	public ResponseEntity<RegisterStudent> getRegisterStudent(@PathVariable Long id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/registerstudent")
	public List<RegisterStudent> getAllRegisterStudent() {
		return repo.findAllOrderByDateDescNative();
	}

	@PostMapping("registerstudent/add")
	public ResponseEntity<String> addStudent(@RequestBody RegisterStudent student) throws MessagingException {

		if (student.getEmail() == null || student.getEmail().isBlank()) {
			throw new IllegalArgumentException("Email is required");
		}
		if (student.getMobile() == null || student.getMobile().isBlank()) {
			throw new IllegalArgumentException("Mobile number is required");
		}

		RegisterStudent existing = repo.findByEmail(student.getEmail());
		if (existing != null && !"DELETED".equalsIgnoreCase(existing.getStatus())) {
			throw new RuntimeException("Email already exists in the system");
		}
		if (repo.existsByMobile(student.getMobile())) {
			// existsByMobile() checks the whole table, so reactivating a
			// previously-deleted row with its own unchanged mobile number would
			// otherwise always "conflict" with itself. Only block genuinely
			// different students sharing a mobile.
			boolean mobileBelongsToReactivatedRecord = existing != null
					&& student.getMobile().equals(existing.getMobile());
			if (!mobileBelongsToReactivatedRecord) {
				throw new RuntimeException("Mobile number already exists in the system");
			}
		}
		if (existing != null) {
			// email has a DB-level unique constraint — reuse the previously-deleted
			// row's id so this save() updates it in place instead of inserting a
			// duplicate.
			student.setId(existing.getId());
			// Preserve its existing student_id too - student_remarks_history rows
			// may already reference it, and overwriting it with a freshly
			// generated one orphans those rows and fails the FK constraint on
			// this UPDATE.
			student.setStudentId(existing.getStudentId());
			// `student` is deserialized fresh from the request body, so any
			// field the caller omitted is null here even though the existing
			// row may already have a real value. Without this, re-registering
			// with only name/email/mobile (the normal case) would silently
			// erase every other previously-saved field. Only backfill fields
			// that are actually still null after the request is applied below,
			// so anything the caller did supply always wins.
			preserveExistingValuesForOmittedFields(student, existing);
		}
		student.setAdditional_email(null);
		student.setAdditional_phone(0);
		student.setDate(LocalDate.now());
		student.setCoordinator(student.getCoordinator());

		String tempPassword = "Hach@123";
		String hashedPassword = passwordEncoder.encode(tempPassword);
		student.setPassword(hashedPassword);

		String fullName = student.getUserName();
		if (student.getStudentId() == null || student.getStudentId().isBlank()) {
			student.setStudentId(generateNextStudentId());
		}
		student.setLeadStatus(student.getLeadStatus());
		student.setStatus(student.getStatus());

		student.setLeadTag(student.getLeadTag());
		emailService.sendEmailForRegisterOffline(student.getEmail(), tempPassword, fullName, student.getCoordinator());

		RegisterStudent save = repo.save(student);
		webhookSenderService.sendRegistrationDetailsOffline(save);
		return ResponseEntity.ok("Student added successfully");
	}

	// Backfills fields on `incoming` (a fresh RegisterStudent deserialized from
	// a request body) with values from `existing` wherever `incoming` is still
	// null - i.e. wherever the caller didn't actually supply that field. id,
	// student_id, email, mobile, status and date are handled separately by the
	// caller and intentionally excluded here.
	private void preserveExistingValuesForOmittedFields(RegisterStudent incoming, RegisterStudent existing) {
		if (incoming.getFirstName() == null)
			incoming.setFirstName(existing.getFirstName());
		if (incoming.getLastName() == null)
			incoming.setLastName(existing.getLastName());
		if (incoming.getUserName() == null)
			incoming.setUserName(existing.getUserName());
		if (incoming.getWhatsapp() == null)
			incoming.setWhatsapp(existing.getWhatsapp());
		if (incoming.getCountry() == null)
			incoming.setCountry(existing.getCountry());
		if (incoming.getLocation() == null)
			incoming.setLocation(existing.getLocation());
		if (incoming.getVisa_status() == null)
			incoming.setVisa_status(existing.getVisa_status());
		if (incoming.getTime_zone() == null)
			incoming.setTime_zone(existing.getTime_zone());
		if (incoming.getAnalyst_name() == null)
			incoming.setAnalyst_name(existing.getAnalyst_name());
		if (incoming.getSource() == null)
			incoming.setSource(existing.getSource());
		if (incoming.getComments() == null)
			incoming.setComments(existing.getComments());
		if (incoming.getSend_details() == null)
			incoming.setSend_details(existing.getSend_details());
		if (incoming.getCourse_name() == null)
			incoming.setCourse_name(existing.getCourse_name());
		if (incoming.getDob() == null)
			incoming.setDob(existing.getDob());
		if (incoming.getGender() == null)
			incoming.setGender(existing.getGender());
		if (incoming.getAddress() == null)
			incoming.setAddress(existing.getAddress());
		if (incoming.getBio() == null)
			incoming.setBio(existing.getBio());
		if (incoming.getProfileImage() == null)
			incoming.setProfileImage(existing.getProfileImage());
		if (incoming.getFacebook() == null)
			incoming.setFacebook(existing.getFacebook());
		if (incoming.getTwitter() == null)
			incoming.setTwitter(existing.getTwitter());
		if (incoming.getLinkedin() == null)
			incoming.setLinkedin(existing.getLinkedin());
		if (incoming.getWebsite() == null)
			incoming.setWebsite(existing.getWebsite());
		if (incoming.getGithub() == null)
			incoming.setGithub(existing.getGithub());
		if (incoming.getSeoTeam() == null)
			incoming.setSeoTeam(existing.getSeoTeam());
		if (incoming.getStateCity() == null)
			incoming.setStateCity(existing.getStateCity());
		if (incoming.getCoordinator() == null)
			incoming.setCoordinator(existing.getCoordinator());
		if (incoming.getLeadStatus() == null)
			incoming.setLeadStatus(existing.getLeadStatus());
		if (incoming.getLeadTag() == null)
			incoming.setLeadTag(existing.getLeadTag());
		if (incoming.getMode() == null)
			incoming.setMode(existing.getMode());
	}

	private String generateNextStudentId() {
		String prefix = "HACH";
		String lastStudentId = repo.findTopByOrderByStudentIdDesc();

		int nextNumber = 1;

		if (lastStudentId != null && lastStudentId.startsWith(prefix)) {
			String numberPart = lastStudentId.substring(prefix.length());
			try {
				nextNumber = Integer.parseInt(numberPart) + 1;
			} catch (NumberFormatException e) {
				nextNumber = 1;
			}
		}

		return prefix + String.format("%03d", nextNumber);
	}

	@PutMapping("/registerstudent/update/{id}")
	public ResponseEntity<RegisterStudent> updateRegisterStudent(@PathVariable Long id,
			@RequestBody RegisterStudent req) {

		return repo.findById(id).map(existing -> {

			// ===== BASIC INFO =====
			if (req.getUserName() != null)
				existing.setUserName(req.getUserName());

			if (req.getEmail() != null)
				existing.setEmail(req.getEmail());

			if (req.getMobile() != null)
				existing.setMobile(req.getMobile());

			if (req.getWhatsapp() != null)
				existing.setWhatsapp(req.getWhatsapp());

			if (req.getCountry() != null)
				existing.setCountry(req.getCountry());

			if (req.getLocation() != null)
				existing.setLocation(req.getLocation());

			if (req.getVisa_status() != null)
				existing.setVisa_status(req.getVisa_status());

//			if (req.getTime_zone() != null)
//				existing.setTime_zone(req.getTime_zone());

			if (req.getAnalyst_name() != null)
				existing.setAnalyst_name(req.getAnalyst_name());

			// ===== BUSINESS FIELDS (YOUR BUG WAS HERE) =====
			if (req.getSource() != null)
				existing.setSource(req.getSource());

//			if (req.getRemarks() != null)
//				existing.setRemarks(req.getRemarks());

			if (req.getComments() != null)
				existing.setComments(req.getComments());

			if (req.getSend_details() != null)
				existing.setSend_details(req.getSend_details());

			if (req.getCourse_name() != null)
				existing.setCourse_name(req.getCourse_name());

			if (req.getMode() != null)
				existing.setMode(req.getMode());

			// ===== OPTIONAL CONTACT FIELDS =====
			if (req.getAdditional_email() != null)
				existing.setAdditional_email(req.getAdditional_email());

			if (req.getAdditional_phone() != null)
				existing.setAdditional_phone(req.getAdditional_phone());

			// ===== PROFILE FIELDS =====
			if (req.getFirstName() != null)
				existing.setFirstName(req.getFirstName());

			if (req.getLastName() != null)
				existing.setLastName(req.getLastName());

			if (req.getDob() != null)
				existing.setDob(req.getDob());

			if (req.getGender() != null)
				existing.setGender(req.getGender());

			if (req.getAddress() != null)
				existing.setAddress(req.getAddress());

			if (req.getBio() != null)
				existing.setBio(req.getBio());

			if (req.getProfileImage() != null)
				existing.setProfileImage(req.getProfileImage());

			// ===== SOCIAL LINKS =====
			if (req.getFacebook() != null)
				existing.setFacebook(req.getFacebook());

			if (req.getTwitter() != null)
				existing.setTwitter(req.getTwitter());

			if (req.getLinkedin() != null)
				existing.setLinkedin(req.getLinkedin());

			if (req.getWebsite() != null)
				existing.setWebsite(req.getWebsite());

			if (req.getGithub() != null)
				existing.setGithub(req.getGithub());

			// ===== SECURITY / OTP (DO NOT AUTO-RESET) =====
			if (req.getOTP() != null)
				existing.setOTP(req.getOTP());

			if (req.getOTPStatus() != null)
				existing.setOTPStatus(req.getOTPStatus());

			if (req.getOtpGeneratedTime() != null)
				existing.setOtpGeneratedTime(req.getOtpGeneratedTime());

			// ===== PASSWORD (ONLY IF SENT) =====
			if (req.getPassword() != null && !req.getPassword().isBlank())
				existing.setPassword(req.getPassword());

			// ===== STATUS =====
			if (req.getStatus() != null)
				existing.setStatus(req.getStatus());

			if (req.getCoordinator() != null)
			    existing.setCoordinator(req.getCoordinator());
			if (req.getSeoTeam() != null)
				existing.setSeoTeam(req.getSeoTeam());

			if (req.getCourse_name() != null)
				existing.setCourse_name(req.getCourse_name());

			if (req.getStateCity() != null)
				existing.setStateCity(req.getStateCity());

			if (req.getLeadStatus() != null)
				existing.setLeadStatus(req.getLeadStatus());
			
			if (req.getLeadTag() != null || req.getTime_zone() != null) {

			    boolean tagChanged = false;
			    boolean timezoneChanged = false;

			    // ✅ CHECK LEAD TAG CHANGE
			    if (req.getLeadTag() != null) {

			        tagChanged =
			                existing.getLeadTag() == null ||
			                !existing.getLeadTag()
			                        .equalsIgnoreCase(req.getLeadTag());
			    }

			    // ✅ CHECK TIMEZONE CHANGE
			    if (req.getTime_zone() != null) {

			        timezoneChanged =
			                existing.getTime_zone() == null ||
			                !existing.getTime_zone()
			                        .equalsIgnoreCase(req.getTime_zone());
			    }

			    // ✅ IF EITHER CHANGED → CHECK AUTOMATION
			    if (tagChanged || timezoneChanged) {

			        Long automationCount =
			                automationRuleRepository
			                .existsRunningAutomationByLeadStatusAndTimezone(
			                        existing.getLeadTag(),
			                        existing.getTime_zone());

			        if (automationCount > 0) {

			            throw new RuntimeException(
			                    "This lead is under automation. Cannot change Lead Tag or Time Zone now.");
			        }
			    }

			    // ✅ UPDATE VALUES
			    if (req.getLeadTag() != null) {
			        existing.setLeadTag(req.getLeadTag());
			    }

			    if (req.getTime_zone() != null) {
			        existing.setTime_zone(req.getTime_zone());
			    }
			}
			if (req.getStatus() != null)
				existing.setStatus(req.getStatus());

			// ===== AUDIT =====
//			existing.setDate(LocalDate.now()); // update date on edit

			repo.save(existing);
			return ResponseEntity.ok(existing);

		}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@DeleteMapping("registerstudent/delete/{id}")
	public ResponseEntity<?> deleteRegisterStudent(@PathVariable Long id) {

		RegisterStudent student = repo.findById(id)
				.orElseThrow(() -> new RuntimeException("Student not found"));

		// Soft delete: only the Registration Portal record is deactivated
		// (status = "DELETED"). Payments, Enrollments, Certificates, etc. are
		// untouched, since the row itself — and its id — is never removed, so
		// nothing referencing it can be orphaned. This also removes the need to
		// block deletion when the student has enrollment history.
		student.setStatus("DELETED");
		repo.save(student);

		return ResponseEntity.ok("Student deleted successfully.");
	}

	@GetMapping("/check-mobile")
	public ResponseEntity<?> checkMobileExists(@RequestParam String mobile) {
		int count = repo.countByMobile(mobile);
		if (count > 0) {
			return ResponseEntity.status(HttpStatus.CONFLICT).body("Mobile number already exists");
		} else {
			return ResponseEntity.ok("Mobile number is available");
		}
	}

	@PostMapping("/register-student/import")
	public ResponseEntity<ImportResponse> importExcel(@RequestParam("file") MultipartFile file) {

		try {
			ImportResponse response = service.importExcel(file);
			return ResponseEntity.ok(response);
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
		}
	}

	@PostMapping("/register-student/add-remark")
	public StudentRemarkResponse addRemark(@RequestBody StudentRemarkRequest request) {
		return service.addStudentRemark(request);
	}

	@GetMapping("/remarks/{studentId}")
	public List<StudentRemarksHistory> getRemarks(@PathVariable String studentId) {
		return service.getRemarksByStudentId(studentId);
	}

	@PostMapping("/enquiryformcreate")
	public EnquiryResponse createEnquiry(@RequestBody EnquiryRequest request) throws MessagingException {
		return service.saveEnquiry(request);
	}

	@GetMapping("/registerstudent-with-remarks")
	public List<RegisterStudentResponseDTO> getStudentsWithRemarks() {
		return service.getStudentsWithRemarks();
	}

	@GetMapping("/lead-dashboard")
	public List<LeadDashboardDTO> getLeadDashboard() {
		return service.getLeadDashboard();
	}

	@GetMapping("/register-leadtag")
	public ResponseEntity<List<String>> getAllLeadTags() {
		List<String> tags = service.getAllUniqueLeadTags();
		return ResponseEntity.ok(tags);
	}

	@GetMapping("/register-leadstatus")
	public ResponseEntity<List<String>> getAllLeadStatus() {
		List<String> statusList = service.getAllUniqueLeadStatus();
		return ResponseEntity.ok(statusList);
	}
	@GetMapping("/get-status")
	public ResponseEntity<?> getStatus(@RequestParam String email) {

	    try {
	        String status = service.getStudentStatus(email);

	        return ResponseEntity.ok(status);

	    } catch (RuntimeException ex) {
	        return ResponseEntity.badRequest().body(ex.getMessage());
	    }
	}
	@PostMapping("/send-email/{studentId}")
	public ResponseEntity<?> sendEmail(@PathVariable String studentId) {
	    emailCronService.sendSingleEmail(studentId);
	    return ResponseEntity.ok("Email sent");
	}
	@GetMapping("/register-timezones")
	public ResponseEntity<List<String>> getAllTimeZones() {
	    return ResponseEntity.ok(service.getAllTimeZones());
	}
 @GetMapping("/seo-team")
	    public ResponseEntity<List<String>> getSeoTeams() {
	        return ResponseEntity.ok(service.getSeoTeams());
	    }
}