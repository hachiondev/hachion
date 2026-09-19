package com.hachionUserDashboard.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "interview_review")
public class InterviewReview {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "interview_assignment_id", nullable = false)
	private InterviewAssignment assignment;

	@Column(name = "reviewer_user_id", nullable = false)
	private Long reviewerUserId;

	@Column(name = "overall_rating")
	private Integer overallRating;

	@Column(name = "final_status", length = 50)
	private String finalStatus;

	@Column(name = "comments", columnDefinition = "TEXT")
	private String comments;

	@Column(name = "reviewed_at")
	private LocalDateTime reviewedAt;

	public InterviewReview() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public InterviewAssignment getAssignment() {
		return assignment;
	}

	public void setAssignment(InterviewAssignment assignment) {
		this.assignment = assignment;
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
