package com.hachionUserDashboard.dto;

public class InterviewResponseRequest {

	private Long questionId;
	private String videoUrl;
	private Integer videoDurationSeconds;
	private Integer retriesUsed;

	public InterviewResponseRequest() {
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
}
