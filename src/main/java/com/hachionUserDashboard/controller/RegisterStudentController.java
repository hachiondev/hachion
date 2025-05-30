package com.hachionUserDashboard.controller;

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

@CrossOrigin
//@CrossOrigin(origins ="http://localhost:3000")
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"})
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
		return repo.findAll();
	}

	@PostMapping("registerstudent/add")
	public ResponseEntity<String> addStudent(@RequestBody RegisterStudent student) {

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

		String tempPassword = "Hach@123";
		String hashedPassword = passwordEncoder.encode(tempPassword);
		student.setPassword(hashedPassword);

		student.setStudentId(generateNextStudentId());

		emailService.sendWelcomeEmail(student.getEmail(), tempPassword);

		repo.save(student);
		System.out.println("Add data: " + student);
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

//    @PutMapping("/registerstudent/update/{id}")
//    public ResponseEntity<String> editStudent(
//        @PathVariable int id, 
//        @RequestBody RegisterStudent updatedStudent
//    ) {
//        Optional<RegisterStudent> optionalStudent = repo.findById(id);
//        if (optionalStudent.isPresent()) {
//            RegisterStudent existingStudent = optionalStudent.get();
//            existingStudent.setAdditional_email(updatedStudent.getAdditional_email());
//            existingStudent.setAdditional_phone(updatedStudent.getAdditional_phone());
//            existingStudent.setPassword(updatedStudent.getPassword());
//           repo.save(existingStudent);
//            return ResponseEntity.ok("Student updated successfully");
//        } else {
//            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Student not found");
//        }
//    }

//    @PostMapping("/registerstudent/add")
//    @ResponseStatus(code = HttpStatus.CREATED)
//    public void createRegisterStudent(@RequestBody RegisterStudent registerstudent) {
//        repo.save(registerstudent);
//    }
//
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
		RegisterStudent registerstudent = repo.findById(id).get();
		repo.delete(registerstudent);
		return null;

	}
}