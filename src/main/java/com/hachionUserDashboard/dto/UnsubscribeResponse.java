package com.hachionUserDashboard.dto;

import java.time.LocalDate;

public class UnsubscribeResponse {

	private Long unsubscribeId;

	private String email;

	private String mobile;

	private String userName;

	private LocalDate date;

	private String country;

	public Long getUnsubscribeId() {
		return unsubscribeId;
	}

	public void setUnsubscribeId(Long unsubscribeId) {
		this.unsubscribeId = unsubscribeId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

}
