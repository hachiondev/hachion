package com.hachionUserDashboard.dto;

import java.time.LocalDateTime;

public class InterviewAssignmentResponse {

	private Long id;
	private Long templateId;
	private Long candidateUserId;
	private String candidateName;
	private String candidateEmail;
	private String secureToken;
	private String status;
	private LocalDateTime expiryDateTime;
	private LocalDateTime startedAt;
	private LocalDateTime completedAt;
	private LocalDateTime createdAt;

	public InterviewAssignmentResponse() {
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

	public Long getCandidateUserId() {
		return candidateUserId;
	}

	public void setCandidateUserId(Long candidateUserId) {
		this.candidateUserId = candidateUserId;
	}

	public String getCandidateName() {
		return candidateName;
	}

	public void setCandidateName(String candidateName) {
		this.candidateName = candidateName;
	}

	public String getCandidateEmail() {
		return candidateEmail;
	}

	public void setCandidateEmail(String candidateEmail) {
		this.candidateEmail = candidateEmail;
	}

	public String getSecureToken() {
		return secureToken;
	}

	public void setSecureToken(String secureToken) {
		this.secureToken = secureToken;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getExpiryDateTime() {
		return expiryDateTime;
	}

	public void setExpiryDateTime(LocalDateTime expiryDateTime) {
		this.expiryDateTime = expiryDateTime;
	}

	public LocalDateTime getStartedAt() {
		return startedAt;
	}

	public void setStartedAt(LocalDateTime startedAt) {
		this.startedAt = startedAt;
	}

	public LocalDateTime getCompletedAt() {
		return completedAt;
	}

	public void setCompletedAt(LocalDateTime completedAt) {
		this.completedAt = completedAt;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}
