package com.hachionUserDashboard.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "general_faq")
public class GeneralFaq {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long faqId;

	@Column(nullable = false, length = 300)
	private String faqTitle;

	@Lob
	@Column(columnDefinition = "TEXT")
	private String description;

	@Column(nullable = false)
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
