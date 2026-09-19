package com.hachionUserDashboard.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.entity.InstructorApplication;

import Service.InstructorApplicationService;
import lombok.RequiredArgsConstructor;

@RequestMapping
@CrossOrigin
@RestController
@RequiredArgsConstructor
public class InstructorApplicationController {

	@Autowired
	private InstructorApplicationService service;

	@GetMapping("/instructor/{id}")
	public ResponseEntity<InstructorApplication> get(@PathVariable Integer id) {
		return service.get(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/instructor")
	public List<InstructorApplication> all() {
		return service.getAll();
	}

	@PostMapping(value = "/instructor/apply", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public ResponseEntity<String> create(@RequestPart("instructor") String instructorJson,
			@RequestPart(value = "resume", required = false) MultipartFile resume) {
		try {
			service.create(instructorJson, resume);
			return ResponseEntity.status(HttpStatus.CREATED).body("Instructor application submitted successfully.");
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error creating instructor application: " + e.getMessage());
		}
	}

	@DeleteMapping("/instructor/delete/{id}")
	public ResponseEntity<String> delete(@PathVariable Integer id) {
		try {
			service.delete(id);
			return ResponseEntity.ok("Instructor application deleted successfully.");
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error deleting instructor application: " + e.getMessage());
		}
	}

	@GetMapping("/instructor/resumes/{filename:.+}")
	public ResponseEntity<byte[]> getResume(@PathVariable String filename) {
		try {
			byte[] bytes = service.getResumeBytes(filename);
			String contentType = service.getResumeContentType(filename);
			return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(bytes);
		} catch (IOException e) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
	}
}