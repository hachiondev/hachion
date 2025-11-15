package com.hachionUserDashboard.service;

import java.time.LocalDateTime;
import java.time.format.DateTimeParseException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.InterviewAssignmentRequest;
import com.hachionUserDashboard.dto.InterviewAssignmentResponse;
import com.hachionUserDashboard.entity.InterviewAssignment;
import com.hachionUserDashboard.entity.InterviewTemplate;
import com.hachionUserDashboard.repository.InterviewAssignmentRepository;
import com.hachionUserDashboard.repository.InterviewTemplateRepository;

import Service.InterviewAssignmentService;

@Service
public class InterviewAssignmentServiceImpl implements InterviewAssignmentService {

	@Autowired
	private InterviewAssignmentRepository interviewAssignmentRepository;

	@Autowired
	private InterviewTemplateRepository interviewTemplateRepository;

	@Override
	public InterviewAssignmentResponse createAssignment(Long templateId, InterviewAssignmentRequest request) {
		Optional<InterviewTemplate> optionalTemplate = interviewTemplateRepository.findById(templateId);
		if (!optionalTemplate.isPresent()) {
			throw new RuntimeException("InterviewTemplate not found with id: " + templateId);
		}
		InterviewTemplate template = optionalTemplate.get();

		InterviewAssignment assignment = new InterviewAssignment();
		assignment.setTemplate(template);
		assignment.setCandidateUserId(request.getCandidateUserId());
		assignment.setCandidateName(request.getCandidateName());
		assignment.setCandidateEmail(request.getCandidateEmail());
		assignment.setSecureToken(generateSecureToken());
		assignment.setStatus("NOT_STARTED");
		assignment.setCreatedAt(LocalDateTime.now());

		if (request.getExpiryDateTime() != null && !request.getExpiryDateTime().isEmpty()) {
			try {
				assignment.setExpiryDateTime(LocalDateTime.parse(request.getExpiryDateTime()));
			} catch (DateTimeParseException ex) {
				throw new RuntimeException("Invalid expiryDateTime format, expected ISO-8601");
			}
		}

		InterviewAssignment saved = interviewAssignmentRepository.save(assignment);
		return mapToResponse(saved);
	}

	@Override
	public List<InterviewAssignmentResponse> getAssignmentsForTemplate(Long templateId) {
		List<InterviewAssignment> list = interviewAssignmentRepository.findByTemplateId(templateId);
		List<InterviewAssignmentResponse> result = new ArrayList<>();
		for (InterviewAssignment a : list) {
			result.add(mapToResponse(a));
		}
		return result;
	}

	@Override
	public InterviewAssignmentResponse getAssignmentForCandidate(Long assignmentId, String token) {
		InterviewAssignment assignment = interviewAssignmentRepository.findByIdAndToken(assignmentId, token);
		if (assignment == null) {
			throw new RuntimeException("Invalid assignmentId or token");
		}
		return mapToResponse(assignment);
	}

	@Override
	public InterviewAssignmentResponse startInterview(Long assignmentId, String token) {
		InterviewAssignment assignment = interviewAssignmentRepository.findByIdAndToken(assignmentId, token);
		if (assignment == null) {
			throw new RuntimeException("Invalid assignmentId or token");
		}
		assignment.setStatus("IN_PROGRESS");
		assignment.setStartedAt(LocalDateTime.now());
		InterviewAssignment saved = interviewAssignmentRepository.save(assignment);
		return mapToResponse(saved);
	}

	@Override
	public InterviewAssignmentResponse completeInterview(Long assignmentId, String token) {
		InterviewAssignment assignment = interviewAssignmentRepository.findByIdAndToken(assignmentId, token);
		if (assignment == null) {
			throw new RuntimeException("Invalid assignmentId or token");
		}
		assignment.setStatus("COMPLETED");
		assignment.setCompletedAt(LocalDateTime.now());
		InterviewAssignment saved = interviewAssignmentRepository.save(assignment);
		return mapToResponse(saved);
	}

	private String generateSecureToken() {
		return UUID.randomUUID().toString().replace("-", "");
	}

	private InterviewAssignmentResponse mapToResponse(InterviewAssignment a) {
		InterviewAssignmentResponse dto = new InterviewAssignmentResponse();
		dto.setId(a.getId());
		dto.setTemplateId(a.getTemplate().getId());
		dto.setCandidateUserId(a.getCandidateUserId());
		dto.setCandidateName(a.getCandidateName());
		dto.setCandidateEmail(a.getCandidateEmail());
		dto.setSecureToken(a.getSecureToken());
		dto.setStatus(a.getStatus());
		dto.setExpiryDateTime(a.getExpiryDateTime());
		dto.setStartedAt(a.getStartedAt());
		dto.setCompletedAt(a.getCompletedAt());
		dto.setCreatedAt(a.getCreatedAt());
		return dto;
	}
}
