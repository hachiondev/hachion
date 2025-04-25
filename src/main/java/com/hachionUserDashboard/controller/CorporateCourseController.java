package com.hachionUserDashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.entity.CorporateCourse;
import com.hachionUserDashboard.repository.CorporateCourseRepository;

@CrossOrigin
@RestController
public class CorporateCourseController {

	@Autowired
	private CorporateCourseRepository repo;

	@GetMapping("/corporatecourse/{id}")
	public ResponseEntity<CorporateCourse> getCorporateCourse(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/corporatecourse")
	public List<CorporateCourse> getAllCorporateCourse() {
		return repo.findAll();
	}

	@PostMapping("/corporatecourse/add")
	@ResponseStatus(code = HttpStatus.CREATED)
	public ResponseEntity<String> createCorporateCourse(@RequestBody CorporateCourse corporatecourse) {
		repo.save(corporatecourse);
		return ResponseEntity.status(HttpStatus.CREATED).body("Corporate course added successfully.");
	}

	@PutMapping("/corporatecourse/update/{id}")
	public ResponseEntity<CorporateCourse> updatedCorporateCourse(@PathVariable int id,
			@RequestBody CorporateCourse updatedCorporateCourse) {
		return repo.findById(id).map(corporatecourse -> {
			corporatecourse.setCategory_name(updatedCorporateCourse.getCategory_name());
			corporatecourse.setCourse_name(updatedCorporateCourse.getCourse_name());
			corporatecourse.setStatus(updatedCorporateCourse.isStatus());

			repo.save(corporatecourse);
			return ResponseEntity.ok(corporatecourse);
		}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@DeleteMapping("corporatecourse/delete/{id}")
	public ResponseEntity<?> deleteCorporateCourse(@PathVariable int id) {
		CorporateCourse corporatecourse = repo.findById(id).get();
		repo.delete(corporatecourse);
		return null;

	}
}