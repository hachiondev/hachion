package com.hachionUserDashboard.dto;

public class LeadDashboardDTO {

	private String name;
	private String course;
	private String leadTag;
	private String leadStatus;
	private String lastCallMadeOn;
	private String coordinator;

	public LeadDashboardDTO(String name, String course, String leadTag, String leadStatus, String lastCallMadeOn,
			String coordinator) {
		this.name = name;
		this.course = course;
		this.leadTag = leadTag;
		this.leadStatus = leadStatus;
		this.lastCallMadeOn = lastCallMadeOn;
		this.coordinator = coordinator;
	}

	// Getters
	public String getName() {
		return name;
	}

	public String getCourse() {
		return course;
	}

	public String getLeadTag() {
		return leadTag;
	}

	public String getLeadStatus() {
		return leadStatus;
	}

	public String getLastCallMadeOn() {
		return lastCallMadeOn;
	}

	public String getCoordinator() {
		return coordinator;
	}
}