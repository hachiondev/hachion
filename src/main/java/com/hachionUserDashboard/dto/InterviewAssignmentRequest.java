package com.hachionUserDashboard.dto;

public class InterviewAssignmentRequest {

	private Long candidateUserId;
	private String candidateName;
	private String candidateEmail;
	private String expiryDateTime;

	public InterviewAssignmentRequest() {
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

	public String getExpiryDateTime() {
		return expiryDateTime;
	}

	public void setExpiryDateTime(String expiryDateTime) {
		this.expiryDateTime = expiryDateTime;
	}
}
