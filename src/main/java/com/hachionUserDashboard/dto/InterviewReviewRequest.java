package com.hachionUserDashboard.dto;

public class InterviewReviewRequest {

	private Long reviewerUserId;
	private Integer overallRating;
	private String finalStatus; 
	private String comments;

	public InterviewReviewRequest() {
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
}
