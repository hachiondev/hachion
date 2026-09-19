package com.hachionUserDashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

@Entity
@Table(name = "email_automation_rules")
public class EmailAutomationRule {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	@Column(name = "rule_name")
	private String ruleName;

	@Column(name = "lead_status")
	private String leadStatus;

	@Column(name = "timezone")
	private String timezone;

	@Column(name = "frequency_days")
	private Integer frequencyDays = 3;

	@Column(name = "send_time")
	private LocalTime sendTime;

	@Column(name = "start_date")
	private LocalDate startDate;

	@Column(name = "end_date")
	private LocalDate endDate;

	@Column(name = "enabled")
	private Boolean enabled = true;

	@Column(name = "max_emails")
	private Integer maxEmails = 50;

	@Column(name = "total_matched")
	private Integer totalMatched = 0;

	@Column(name = "success_count")
	private Integer successCount = 0;

	@Column(name = "failed_count")
	private Integer failedCount = 0;
	
	@Column(name = "last_run_at")
	private LocalDateTime lastRunAt;

	@Column(name = "created_at")
	private LocalDateTime createdAt = LocalDateTime.now();

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLeadStatus() {
		return leadStatus;
	}

	public void setLeadStatus(String leadStatus) {
		this.leadStatus = leadStatus;
	}

	public String getTimezone() {
		return timezone;
	}

	public void setTimezone(String timezone) {
		this.timezone = timezone;
	}

	public Integer getFrequencyDays() {
		return frequencyDays;
	}

	public void setFrequencyDays(Integer frequencyDays) {
		this.frequencyDays = frequencyDays;
	}

	public LocalTime getSendTime() {
		return sendTime;
	}

	public void setSendTime(LocalTime sendTime) {
		this.sendTime = sendTime;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getEndDate() {
		return endDate;
	}

	public void setEndDate(LocalDate endDate) {
		this.endDate = endDate;
	}

	public Boolean getEnabled() {
		return enabled;
	}

	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}

	public Integer getMaxEmails() {
		return maxEmails;
	}

	public void setMaxEmails(Integer maxEmails) {
		this.maxEmails = maxEmails;
	}

	public LocalDateTime getLastRunAt() {
		return lastRunAt;
	}

	public void setLastRunAt(LocalDateTime lastRunAt) {
		this.lastRunAt = lastRunAt;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public Integer getTotalMatched() {
		return totalMatched;
	}

	public void setTotalMatched(Integer totalMatched) {
		this.totalMatched = totalMatched;
	}

	public Integer getSuccessCount() {
		return successCount;
	}

	public void setSuccessCount(Integer successCount) {
		this.successCount = successCount;
	}

	public Integer getFailedCount() {
		return failedCount;
	}

	public void setFailedCount(Integer failedCount) {
		this.failedCount = failedCount;
	}

	public String getRuleName() {
		return ruleName;
	}

	public void setRuleName(String ruleName) {
		this.ruleName = ruleName;
	}

}