package com.hachionUserDashboard.dto;


import java.time.LocalDate;
import java.time.LocalTime;

public class EmailAutomationRuleRequestDTO {

    private String leadStatus;

    private String timezone;

    private Integer frequencyDays;

    private LocalTime sendTime;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean enabled;

    private Integer maxEmails;

    private String ruleName;
    
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

	public String getRuleName() {
		return ruleName;
	}

	public void setRuleName(String ruleName) {
		this.ruleName = ruleName;
	}
    
}