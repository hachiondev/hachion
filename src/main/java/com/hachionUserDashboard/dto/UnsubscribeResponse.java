package com.hachionUserDashboard.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonInclude;

public class UnsubscribeResponse {

	private Long unsubscribeId;

	private String email;

	private String mobile;

	private String userName;

	private LocalDate date;

	private String country;

	private String reason;

	private String comments;

	private String chooseDuration;

	// Outcome of POST /unsubscribe (UNSUBSCRIBED or ALREADY_UNSUBSCRIBED) plus a
	// user-facing message. Field-level NON_NULL keeps the admin GET /unsubscribe
	// list payload unchanged - these are only populated on the POST response.
	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String status;

	@JsonInclude(JsonInclude.Include.NON_NULL)
	private String message;

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

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

	public String getReason() {
		return reason;
	}

	public void setReason(String reason) {
		this.reason = reason;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public String getChooseDuration() {
		return chooseDuration;
	}

	public void setChooseDuration(String chooseDuration) {
		this.chooseDuration = chooseDuration;
	}

}
