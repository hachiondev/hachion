package com.hachionUserDashboard.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_question")
public class InterviewQuestion {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "interview_template_id", nullable = false)
	private InterviewTemplate template;

	@Column(name = "question_text", nullable = false, columnDefinition = "TEXT")
	private String questionText;

	@Column(name = "answer_type", nullable = false, length = 20)
	private String answerType;

	@Column(name = "max_duration_seconds")
	private Integer maxDurationSeconds;

	@Column(name = "prep_time_seconds")
	private Integer prepTimeSeconds;

	@Column(name = "max_retries")
	private Integer maxRetries;

	@Column(name = "display_order")
	private Integer displayOrder;

	@Column(name = "created_at", nullable = false)
	private LocalDateTime createdAt = LocalDateTime.now();

	public InterviewQuestion() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public InterviewTemplate getTemplate() {
		return template;
	}

	public void setTemplate(InterviewTemplate template) {
		this.template = template;
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