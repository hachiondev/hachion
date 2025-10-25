package com.hachionUserDashboard.dto;

public class FaqQueryRequest {

	private Long faqQueryId;

	private String name;

	private String emailId;

	private String message;

	public Long getFaqQueryId() {
		return faqQueryId;
	}

	public void setFaqQueryId(Long faqQueryId) {
		this.faqQueryId = faqQueryId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

}
