package com.hachionUserDashboard.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
//@Getter
//@Setter
@Table(name = "workshop")
public class Workshop {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "workshop_id")
	private Long workshopId;

	@Column(name = "course_name")
	private String courseName;

	@Column(name = "course_category")
	private String courseCategory;

	@Column(name = "date", nullable = false)
	private String date;

	@Column(name = "time")
	private String time;

	@Column(name = "time_zone")
	private String timeZone;

	@Column(name = "full_name", nullable = false)
	private String fullName;

	@Column(name = "email_id", nullable = false)
	private String emailId;

	@Column(name = "mobile_number", nullable = false)
	private String mobileNumber;

	private String country;

	public Long getWorkshopId() {
		return workshopId;
	}

	public void setWorkshopId(Long workshopId) {
		this.workshopId = workshopId;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public String getCourseCategory() {
		return courseCategory;
	}

	public void setCourseCategory(String courseCategory) {
		this.courseCategory = courseCategory;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public String getTimeZone() {
		return timeZone;
	}

	public void setTimeZone(String timeZone) {
		this.timeZone = timeZone;
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

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public Workshop(Long workshopId, String courseName, String courseCategory, String date, String time,
			String timeZone, String fullName, String emailId, String mobileNumber, String country) {
		super();
		this.workshopId = workshopId;
		this.courseName = courseName;
		this.courseCategory = courseCategory;
		this.date = date;
		this.time = time;
		this.timeZone = timeZone;
		this.fullName = fullName;
		this.emailId = emailId;
		this.mobileNumber = mobileNumber;
		this.country = country;
	}

	public Workshop() {
		super();
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

}
