package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "talk_to_our_advisor")
public class TalkToOurAdvisor {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Long id;

	@Column(name = "full_name", nullable = false)
	private String fullName;

	@Column(name = "email_id", nullable = false)
	private String emailId;

	@Column(name = "no_of_people")
	private String noOfPeople;

	@Column(name = "company_name")
	private String companyName;

	@Column(name = "mobile_number", nullable = false)
	private String mobileNumber;

	@Column(name = "training_course", nullable = false)
	private String trainingCourse;

	@Lob
	@Column(nullable = true, columnDefinition = "LONGTEXT")
	private String comments;

	private String country;
	
	@Column(name = "date")
	private LocalDate date;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getNoOfPeople() {
		return noOfPeople;
	}

	public void setNoOfPeople(String noOfPeople) {
		this.noOfPeople = noOfPeople;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getTrainingCourse() {
		return trainingCourse;
	}

	public void setTrainingCourse(String trainingCourse) {
		this.trainingCourse = trainingCourse;
	}

	public String getComments() {
		return comments;
	}

	public void setComments(String comments) {
		this.comments = comments;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public TalkToOurAdvisor() {
		super();
	}
	

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public TalkToOurAdvisor(Long id, String fullName, String emailId, String noOfPeople, String companyName,
			String mobileNumber, String trainingCourse, String comments, String country, LocalDate date) {
		super();
		this.id = id;
		this.fullName = fullName;
		this.emailId = emailId;
		this.noOfPeople = noOfPeople;
		this.companyName = companyName;
		this.mobileNumber = mobileNumber;
		this.trainingCourse = trainingCourse;
		this.comments = comments;
		this.country = country;
		this.date = date;
	}


}
