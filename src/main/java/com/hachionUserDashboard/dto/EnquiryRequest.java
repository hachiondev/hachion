package com.hachionUserDashboard.dto;

public class EnquiryRequest {
	private String email;
	private String name;
	private String phone;
	private String course;
	private String state;
	private String coordinator;
	private String seoTeam;
	private String country;
	private Boolean whatsappConsent;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getCourse() {
		return course;
	}

	public void setCourse(String course) {
		this.course = course;
	}

	public String getState() {
		return state;
	}

	public void setState(String state) {
		this.state = state;
	}

	public String getCoordinator() {
		return coordinator;
	}

	public void setCoordinator(String coordinator) {
		this.coordinator = coordinator;
	}

	public String getSeoTeam() {
		return seoTeam;
	}

	public void setSeoTeam(String seoTeam) {
		this.seoTeam = seoTeam;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public Boolean getWhatsappConsent() {
		return whatsappConsent;
	}

	public void setWhatsappConsent(Boolean whatsappConsent) {
		this.whatsappConsent = whatsappConsent;
	}

}