package com.hachionUserDashboard.dto;

import java.time.LocalDateTime;

public class InterviewQuestionResponse {

	private Long id;
	private Long templateId;
	private String questionText;
	private String answerType;
	private Integer maxDurationSeconds;
	private Integer prepTimeSeconds;
	private Integer maxRetries;
	private Integer displayOrder;
	private LocalDateTime createdAt;

	public InterviewQuestionResponse() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Long getTemplateId() {
		return templateId;
	}

	public void setTemplateId(Long templateId) {
		this.templateId = templateId;
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

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}
