
package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "kids_summer_training")
public class KidsSummerTrainingEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long kidsSummerTrainingId;

	@Column(name = "full_name", nullable = false)
	private String fullName;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "mobile_number", nullable = false, unique = true)
	private String mobileNumber;

	@Column(name = "country", nullable = false)
	private String country;

	@Column(name = "course_interested", nullable = false)
	private String courseInterested;

	@Column(name = "batch_timing", nullable = false)
	private String batchTiming;
	
	@Column(name = "date", nullable = false)
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