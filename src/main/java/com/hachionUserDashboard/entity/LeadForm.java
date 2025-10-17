package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@JsonIgnoreProperties(ignoreUnknown = true)
@Entity

@Table(name = "lead_form")
public class LeadForm {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "lead_form_id", nullable = false)
	private Long leadFormId;

	@Column(name = "full_name")
	private String fullName;

	@Column(name = "email")
	private String email;

	@Column(name = "mobile_number")
	private String mobileNumber;

	@Column(name = "country")
	private String country;

	@Column(name = "course_interest")
	private String courseInterest;

	@Column(name = "marketer_id")
	private String marketerId;

	private LocalDate date;

	public Long getLeadFormId() {
		return leadFormId;
	}

	public void setLeadFormId(Long leadFormId) {
		this.leadFormId = leadFormId;
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

	public String getCourseInterest() {
		return courseInterest;
	}

	public void setCourseInterest(String courseInterest) {
		this.courseInterest = courseInterest;
	}

	public String getMarketerId() {
		return marketerId;
	}

	public void setMarketerId(String marketerId) {
		this.marketerId = marketerId;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

}
