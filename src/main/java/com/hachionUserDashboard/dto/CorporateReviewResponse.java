package com.hachionUserDashboard.dto;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Lob;

@JsonIgnoreProperties(ignoreUnknown = true)

public class CorporateReviewResponse {

	private int corporateReviewId;

	private String employeeName;

	private String company;

	private String role;

	private Double employeeRating;

	private String location;

	private String courseName;

	@Lob
	private String comment;

	private LocalDate date;

	private String companyLogo;

	public int getCorporateReviewId() {
		return corporateReviewId;
	}

	public void setCorporateReviewId(int corporateReviewId) {
		this.corporateReviewId = corporateReviewId;
	}

	public String getEmployeeName() {
		return employeeName;
	}

	public void setEmployeeName(String employeeName) {
		this.employeeName = employeeName;
	}

	public String getCompany() {
		return company;
	}

	public void setCompany(String company) {
		this.company = company;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public Double getEmployeeRating() {
		return employeeRating;
	}

	public void setEmployeeRating(Double employeeRating) {
		this.employeeRating = employeeRating;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getCompanyLogo() {
		return companyLogo;
	}

	public void setCompanyLogo(String companyLogo) {
		this.companyLogo = companyLogo;
	}

	@Override
	public String toString() {
		return "CorporateReview [corporateReviewId=" + corporateReviewId + ", employeeName=" + employeeName
				+ ", company=" + company + ", role=" + role + ", employeeRating=" + employeeRating + ", location="
				+ location + ", courseName=" + courseName + ", comment=" + comment + ", date=" + date + ", companyLogo="
				+ companyLogo + "]";
	}

}