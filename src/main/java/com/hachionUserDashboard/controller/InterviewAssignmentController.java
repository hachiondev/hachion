package com.hachionUserDashboard.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.InterviewAssignmentRequest;
import com.hachionUserDashboard.dto.InterviewAssignmentResponse;
import com.hachionUserDashboard.dto.InterviewResponseDto;
import com.hachionUserDashboard.dto.InterviewResponseRequest;

import Service.InterviewAssignmentService;
import Service.InterviewResponseService;

@RestController
@RequestMapping("/api/interviews")
@CrossOrigin
public class InterviewAssignmentController {

	@Autowired
	private InterviewAssignmentService interviewAssignmentService;

	@Autowired
	private InterviewResponseService interviewResponseService;

	// ADMIN: assign interview to candidate
	@PostMapping("/templates/{templateId}/assignments")
	public InterviewAssignmentResponse createAssignment(@PathVariable Long templateId,
			@RequestBody InterviewAssignmentRequest request) {
		return interviewAssignmentService.createAssignment(templateId, request);
	}

	// ADMIN: list assignments for a template
	@GetMapping("/templates/{templateId}/assignments")
	public List<InterviewAssignmentResponse> getAssignmentsForTemplate(@PathVariable Long templateId) {
		return interviewAssignmentService.getAssignmentsForTemplate(templateId);
	}

	// CANDIDATE: get assignment details
	@GetMapping("/assignments/{assignmentId}")
	public InterviewAssignmentResponse getAssignmentForCandidate(@PathVariable Long assignmentId,
			@RequestParam("token") String token) {
		return interviewAssignmentService.getAssignmentForCandidate(assignmentId, token);
	}

	// CANDIDATE: mark as started
	@PutMapping("/assignments/{assignmentId}/start")
	public InterviewAssignmentResponse startInterview(@PathVariable Long assignmentId,
			@RequestParam("token") String token) {
		return interviewAssignmentService.startInterview(assignmentId, token);
	}

	// CANDIDATE: mark as completed
	@PutMapping("/assignments/{assignmentId}/complete")
	public InterviewAssignmentResponse completeInterview(@PathVariable Long assignmentId,
			@RequestParam("token") String token) {
		return interviewAssignmentService.completeInterview(assignmentId, token);
	}

	// CANDIDATE: save one answer
	@PostMapping("/assignments/{assignmentId}/responses")
	public InterviewResponseDto saveResponse(@PathVariable Long assignmentId, @RequestParam("token") String token,
			@RequestBody InterviewResponseRequest request) {
		return interviewResponseService.saveResponse(assignmentId, token, request);
	}

	// ADMIN: get all responses for assignment
	@GetMapping("/assignments/{assignmentId}/responses")
	public List<InterviewResponseDto> getResponses(@PathVariable Long assignmentId) {
		return interviewResponseService.getResponsesForAssignment(assignmentId);
	}

	// ADMIN: search assignments (for Assignment List page)
	@GetMapping("/assignments")
	public List<InterviewAssignmentResponse> searchAssignments(
			@RequestParam(value = "templateId", required = false) Long templateId,
			@RequestParam(value = "status", required = false) String status,
			@RequestParam(value = "search", required = false) String search) {

		return interviewAssignmentService.searchAssignments(templateId, status, search);
	}

	// ADMIN: delete assignment
	@DeleteMapping("/assignments/{assignmentId}")
	public void deleteAssignment(@PathVariable Long assignmentId) {
		interviewAssignmentService.deleteAssignment(assignmentId);
	}

	@PutMapping("/assignments/{assignmentId}")
	public InterviewAssignmentResponse updateAssignment(@PathVariable Long assignmentId,
			@RequestBody InterviewAssignmentRequest request) {
		return interviewAssignmentService.updateAssignment(assignmentId, request);
	}
}
