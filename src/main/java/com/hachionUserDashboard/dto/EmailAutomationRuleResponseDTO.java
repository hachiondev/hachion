package com.hachionUserDashboard.dto;


import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

public class EmailAutomationRuleResponseDTO {

    private Long id;


    private String leadStatus;

    private String timezone;

    private Integer frequencyDays;

    private LocalTime sendTime;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean enabled;

    private Integer maxEmails;

    private LocalDateTime lastRunAt;

    private Long eligibleLeads;
    
    private String ruleName;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
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

    public Long getEligibleLeads() {
        return eligibleLeads;
    }

    public void setEligibleLeads(Long eligibleLeads) {
        this.eligibleLeads = eligibleLeads;
    }
}