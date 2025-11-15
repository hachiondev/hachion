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
@Table(name = "interview_response")
public class InterviewResponse {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "interview_assignment_id", nullable = false)
	private InterviewAssignment assignment;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "interview_question_id", nullable = false)
	private InterviewQuestion question;

	@Column(name = "video_url", length = 500)
	private String videoUrl;

	@Column(name = "video_duration_seconds")
	private Integer videoDurationSeconds;

	@Column(name = "retries_used")
	private Integer retriesUsed;

	@Column(name = "submitted_at")
	private LocalDateTime submittedAt;

	public InterviewResponse() {
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

	public InterviewQuestion getQuestion() {
		return question;
	}

	public void setQuestion(InterviewQuestion question) {
		this.question = question;
	}

	public String getVideoUrl() {
		return videoUrl;
	}

	public void setVideoUrl(String videoUrl) {
		this.videoUrl = videoUrl;
	}

	public Integer getVideoDurationSeconds() {
		return videoDurationSeconds;
	}

	public void setVideoDurationSeconds(Integer videoDurationSeconds) {
		this.videoDurationSeconds = videoDurationSeconds;
	}

	public Integer getRetriesUsed() {
		return retriesUsed;
	}

	public void setRetriesUsed(Integer retriesUsed) {
		this.retriesUsed = retriesUsed;
	}

	public LocalDateTime getSubmittedAt() {
		return submittedAt;
	}

	public void setSubmittedAt(LocalDateTime submittedAt) {
		this.submittedAt = submittedAt;
	}
}
