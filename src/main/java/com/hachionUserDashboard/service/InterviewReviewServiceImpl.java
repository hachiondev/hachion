package com.hachionUserDashboard.service;

import java.time.LocalDateTime;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.InterviewReviewRequest;
import com.hachionUserDashboard.dto.InterviewReviewResponse;
import com.hachionUserDashboard.entity.InterviewAssignment;
import com.hachionUserDashboard.entity.InterviewReview;
import com.hachionUserDashboard.repository.InterviewAssignmentRepository;
import com.hachionUserDashboard.repository.InterviewReviewRepository;

import Service.InterviewReviewService;
import jakarta.transaction.Transactional;

@Service
public class InterviewReviewServiceImpl implements InterviewReviewService {

	@Autowired
	private InterviewReviewRepository interviewReviewRepository;

	@Autowired
	private InterviewAssignmentRepository interviewAssignmentRepository;

	@Override
	public InterviewReviewResponse saveReview(Long assignmentId, InterviewReviewRequest request) {
		Optional<InterviewAssignment> optionalAssignment = interviewAssignmentRepository.findById(assignmentId);
		if (!optionalAssignment.isPresent()) {
			throw new RuntimeException("InterviewAssignment not found with id: " + assignmentId);
		}
		InterviewAssignment assignment = optionalAssignment.get();

		InterviewReview review = new InterviewReview();
		review.setAssignment(assignment);
		review.setReviewerUserId(request.getReviewerUserId());
		review.setOverallRating(request.getOverallRating());
		review.setFinalStatus(request.getFinalStatus());
		review.setComments(request.getComments());
		review.setReviewedAt(LocalDateTime.now());

		InterviewReview saved = interviewReviewRepository.save(review);
		return mapToResponse(saved);
	}

	@Override
	public InterviewReviewResponse getLatestReviewForAssignment(Long assignmentId) {
		InterviewReview review = interviewReviewRepository.findLatestByAssignmentId(assignmentId);
		if (review == null) {
			return null;
		}
		return mapToResponse(review);
	}

	private InterviewReviewResponse mapToResponse(InterviewReview review) {
		InterviewReviewResponse dto = new InterviewReviewResponse();
		dto.setId(review.getId());
		dto.setAssignmentId(review.getAssignment().getId());
		dto.setReviewerUserId(review.getReviewerUserId());
		dto.setOverallRating(review.getOverallRating());
		dto.setFinalStatus(review.getFinalStatus());
		dto.setComments(review.getComments());
		dto.setReviewedAt(review.getReviewedAt());
		return dto;
	}

	@Override
	@Transactional
	public InterviewReviewResponse updateReview(Long assignmentId, Long reviewId, InterviewReviewRequest request) {
		Optional<InterviewReview> optionalReview = interviewReviewRepository.findById(reviewId);
		if (!optionalReview.isPresent()) {
			throw new RuntimeException("Review not found with id: " + reviewId);
		}

		InterviewReview review = optionalReview.get();

		if (!review.getAssignment().getId().equals(assignmentId)) {
			throw new RuntimeException("Review does not belong to this Assignment");
		}

		// update values
		review.setOverallRating(request.getOverallRating());
		review.setFinalStatus(request.getFinalStatus());
		review.setComments(request.getComments());
		review.setReviewedAt(LocalDateTime.now());
		review.setReviewerUserId(request.getReviewerUserId());

		InterviewReview saved = interviewReviewRepository.save(review);
		return mapToResponse(saved);
	}

	@Override
	public void deleteReview(Long assignmentId, Long reviewId) {
		Optional<InterviewReview> optionalReview = interviewReviewRepository.findById(reviewId);
		if (!optionalReview.isPresent()) {
			throw new RuntimeException("Review not found with id: " + reviewId);
		}

		InterviewReview review = optionalReview.get();

		if (!review.getAssignment().getId().equals(assignmentId)) {
			throw new RuntimeException("Review does not belong to this Assignment");
		}

		interviewReviewRepository.delete(review);
	}

}
