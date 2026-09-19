package com.hachionUserDashboard.dto;

public class InterviewQuestionRequest {

	private String questionText;
	private String answerType;
	private Integer maxDurationSeconds;
	private Integer prepTimeSeconds;
	private Integer maxRetries;
	private Integer displayOrder;

	public InterviewQuestionRequest() {
	}

	public String getQuestionText() {
		return questionText;
	}

	public void setQuestionText(String questionText) {
		this.questionText = questionText;
	}

	public String getAnswerType() {
		return answerType;
	}

	public void setAnswerType(String answerType) {
		this.answerType = answerType;
	}

	public Integer getMaxDurationSeconds() {
		return maxDurationSeconds;
	}

	public void setMaxDurationSeconds(Integer maxDurationSeconds) {
		this.maxDurationSeconds = maxDurationSeconds;
	}

	public Integer getPrepTimeSeconds() {
		return prepTimeSeconds;
	}

	public void setPrepTimeSeconds(Integer prepTimeSeconds) {
		this.prepTimeSeconds = prepTimeSeconds;
	}

	public Integer getMaxRetries() {
		return maxRetries;
	}

	public void setMaxRetries(Integer maxRetries) {
		this.maxRetries = maxRetries;
	}

	public Integer getDisplayOrder() {
		return displayOrder;
	}

	public void setDisplayOrder(Integer displayOrder) {
		this.displayOrder = displayOrder;
	}
}
