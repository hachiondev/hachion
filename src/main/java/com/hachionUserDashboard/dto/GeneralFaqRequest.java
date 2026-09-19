package com.hachionUserDashboard.dto;

import java.time.LocalDate;

public class GeneralFaqRequest {

	private Long faqId;

	private String faqTitle;

	private String description;

	private LocalDate date;

	public Long getFaqId() {
		return faqId;
	}

	public void setFaqId(Long faqId) {
		this.faqId = faqId;
	}

	public String getFaqTitle() {
		return faqTitle;
	}

	public void setFaqTitle(String faqTitle) {
		this.faqTitle = faqTitle;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

}