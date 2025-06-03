
package com.hachionUserDashboard.dto;

import java.time.LocalDate;

public class KidsSummerTrainingRequest {

	private Long kidsSummerTrainingId;

	private String fullName;

	private String email;

	private String mobileNumber;

	private String country;

	private String courseInterested;

	private String batchTiming;

	private LocalDate date;

	public Long getKidsSummerTrainingId() {
		return kidsSummerTrainingId;
	}

	public void setKidsSummerTrainingId(Long kidsSummerTrainingId) {
		this.kidsSummerTrainingId = kidsSummerTrainingId;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getCourseInterested() {
		return courseInterested;
	}

	public void setCourseInterested(String courseInterested) {
		this.courseInterested = courseInterested;
	}

	public String getBatchTiming() {
		return batchTiming;
	}

	public void setBatchTiming(String batchTiming) {
		this.batchTiming = batchTiming;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

}