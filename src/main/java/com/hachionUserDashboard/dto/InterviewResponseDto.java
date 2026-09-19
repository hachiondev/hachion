package com.hachionUserDashboard.dto;


import java.time.LocalDateTime;

public class InterviewResponseDto {

	private Long id;
	private Long assignmentId;
	private Long questionId;
	private String videoUrl;
	private Integer videoDurationSeconds;
	private Integer retriesUsed;
	private LocalDateTime submittedAt;

	public InterviewResponseDto() {
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

	public Long getQuestionId() {
		return questionId;
	}

	public void setQuestionId(Long questionId) {
		this.questionId = questionId;
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
