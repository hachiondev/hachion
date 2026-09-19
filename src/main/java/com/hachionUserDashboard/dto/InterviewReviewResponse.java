package com.hachionUserDashboard.dto;

import java.time.LocalDateTime;

public class InterviewReviewResponse {

	private Long id;
	private Long assignmentId;
	private Long reviewerUserId;
	private Integer overallRating;
	private String finalStatus;
	private String comments;
	private LocalDateTime reviewedAt;

	public InterviewReviewResponse() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getAssignmentId() {
		return assignmentId;
	}

	public void setAssignmentId(Long assignmentId) {
		this.assignmentId = assignmentId;
	}

	public Long getReviewerUserId() {
		return reviewerUserId;
	}

	public void setReviewerUserId(Long reviewerUserId) {
		this.reviewerUserId = reviewerUserId;
	}

	public Integer getOverallRating() {
		return overallRating;
	}

	public void setOverallRating(Integer overallRating) {
		this.overallRating = overallRating;
	}

	public String getFinalStatus() {
		return finalStatus;
	}

	public void setFinalStatus(String finalStatus) {
		this.finalStatus = finalStatus;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public LocalDateTime getReviewedAt() {
		return reviewedAt;
	}

	public void setReviewedAt(LocalDateTime reviewedAt) {
		this.reviewedAt = reviewedAt;
	}
}
