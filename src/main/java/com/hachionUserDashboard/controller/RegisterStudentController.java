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
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.repository.RegisterStudentRepository;
import com.hachionUserDashboard.service.EmailService;

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

	@GetMapping("/registerstudent/{id}")
	public ResponseEntity<RegisterStudent> getRegisterStudent(@PathVariable Integer id) {
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

		if (repo.existsByEmail(student.getEmail())) {
			throw new RuntimeException("Email already exists in the system");
		}
		if (repo.existsByMobile(student.getMobile())) {
			throw new RuntimeException("Mobile number already exists in the system");
		}
		student.setAdditional_email(null);
		student.setAdditional_phone(0);
		student.setDate(LocalDate.now());

		String tempPassword = "Hach@123";
		String hashedPassword = passwordEncoder.encode(tempPassword);
		student.setPassword(hashedPassword);

		String fullName = student.getUserName();
		student.setStudentId(generateNextStudentId());

//		emailService.sendEmailForRegisterOfflineStudent(student.getEmail(), tempPassword, fullName);

		repo.save(student);
		return ResponseEntity.ok("Student added successfully");
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
	public ResponseEntity<RegisterStudent> updateRegisterStudent(@PathVariable int id,
			@RequestBody RegisterStudent updatedRegisterStudent) {
		return repo.findById(id).map(registerstudent -> {
			registerstudent.setUserName(updatedRegisterStudent.getUserName());
			registerstudent.setMobile(updatedRegisterStudent.getMobile());
			registerstudent.setEmail(updatedRegisterStudent.getEmail());
			registerstudent.setLocation(updatedRegisterStudent.getLocation());
			registerstudent.setCountry(updatedRegisterStudent.getCountry());
			registerstudent.setTime_zone(updatedRegisterStudent.getTime_zone());
			registerstudent.setCourse_name(updatedRegisterStudent.getCourse_name());
			registerstudent.setAdditional_email(updatedRegisterStudent.getAdditional_email());
			registerstudent.setAdditional_phone(updatedRegisterStudent.getAdditional_phone());
			registerstudent.setPassword(updatedRegisterStudent.getPassword());
			repo.save(registerstudent);
			return ResponseEntity.ok(registerstudent);
		}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@DeleteMapping("registerstudent/delete/{id}")
	public ResponseEntity<?> deleteRegisterStudent(@PathVariable int id) {
		repo.deleteById(id);
		return ResponseEntity.ok("Student deleted successfully.");
	}
}