package com.hachionUserDashboard.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.StudentTrackingFilterRequest;
import com.hachionUserDashboard.dto.StudentTrackingRequest;
import com.hachionUserDashboard.dto.StudentTrackingResponse;
import com.hachionUserDashboard.entity.StudentTracking;
import com.hachionUserDashboard.repository.StudentTrackingRepository;

import Service.StudentTrackingInterface;

@RestController
@RequestMapping("/studentsTracking")
public class StudentTrackingController {

	@Autowired
	private StudentTrackingInterface studentTrackingService;

	@Autowired
	private StudentTrackingRepository studentTrackingRepository;

	@GetMapping("/gettingStudentId")
	public ResponseEntity<List<String>> getStudentIdsByCourseName(@RequestParam String courseName) {
		List<String> studentIds = studentTrackingService.getStudentIdsByCourseName(courseName);
		return ResponseEntity.ok(studentIds);
	}

	@GetMapping("/gettingEmail")
	public ResponseEntity<List<Map<String, Object>>> getStudentCourseInfo(
			@RequestParam(required = false) String studentId, @RequestParam(required = false) String email,
			@RequestParam(required = false) String mobile) {

		List<Map<String, Object>> response = studentTrackingService.getStudentCourseInfo(studentId, email, mobile);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/batches")
	public ResponseEntity<List<String>> getBatchIdsByFilters(@RequestParam(required = false) String studentId,
			@RequestParam(required = false) String email, @RequestParam(required = false) String courseName) {

		List<String> batchIds = studentTrackingService.getBatchIdsByFilters(studentId, email, courseName);
		return ResponseEntity.ok(batchIds);
	}

	@PostMapping("/add")
	public ResponseEntity<StudentTrackingResponse> addStudentTracking(
			@RequestBody StudentTrackingRequest studentTrackingRequest) {
		StudentTrackingResponse response = studentTrackingService.addStudentTracking(studentTrackingRequest);
		return ResponseEntity.ok(response);
	}

	@GetMapping("/batchInfo")
	public ResponseEntity<?> getBatchScheduleInfo(@RequestParam String batchId) {
		return studentTrackingService.getBatchScheduleInfo(batchId);
	}

	@GetMapping
	public ResponseEntity<List<StudentTrackingResponse>> getAllStudentTrackingDetails() {
		List<StudentTrackingResponse> responses = studentTrackingService.listOfStudentTrackingDetails();
		return ResponseEntity.ok(responses);
	}


	@PostMapping("/filter")
	public ResponseEntity<List<StudentTracking>> filterStudents(@RequestBody StudentTrackingFilterRequest request) {
		List<StudentTracking> result = studentTrackingRepository.filterStudentsNative(request.getCourseCategory(),
				request.getCourseName(), request.getBatchId(), request.getBatchType(), request.getStartDate(),
				request.getEndDate());

		return ResponseEntity.ok(result);
	}

	@GetMapping("/batch-ids")
	public ResponseEntity<List<String>> getBatchIdsByStudentFilters(@RequestParam String categoryName,
			@RequestParam String courseName, @RequestParam String batchType) {

		List<String> batchIds = studentTrackingService.getBatchIdsByStudentFilters(categoryName, courseName, batchType);
		return ResponseEntity.ok(batchIds);
	}

	@PutMapping("/update-fields")
	public ResponseEntity<String> updateTrackingFields(@RequestParam String studentId, @RequestParam String batchId,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,
			@RequestParam @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate completedDate,
			@RequestParam int numberOfSessions, @RequestParam int completedSessions, @RequestParam String batchStatus,
			@RequestParam String remarks) {

		boolean updated = studentTrackingService.updateTrackingFields(studentId, batchId, startDate, completedDate,
				numberOfSessions, completedSessions, batchStatus, remarks);

		if (updated) {
			return ResponseEntity.ok("Student tracking updated successfully.");
		} else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Update failed. Record not found.");
		}
	}
}