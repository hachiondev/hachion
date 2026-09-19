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
@Table(name = "corporate_review")
public class CorporateReview {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "corporate_review_id")
	private int corporateReviewId;

	@Column(name = "employee_name")
	private String employeeName;

	@Column(name = "company")
	private String company;

	@Column(name = "role")
	private String role;

	@Column(name = "employee_rating")
	private Double employeeRating;

	@Column(name = "location")
	private String location;

	@Column(name = "course_name")
	private String courseName;
	
	@Column(name = "category_name")
	private String categoryName;

	@Lob
	@Column(nullable = true, columnDefinition = "LONGTEXT")
	private String comment;

	@Column(name = "date")
	private LocalDate date;

	@Lob
	@Column(name = "company_logo")
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

	
	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	@Override
	public String toString() {
		return "CorporateReview [corporateReviewId=" + corporateReviewId + ", employeeName=" + employeeName
				+ ", company=" + company + ", role=" + role + ", employeeRating=" + employeeRating + ", location="
				+ location + ", courseName=" + courseName + ", comment=" + comment + ", date=" + date + ", companyLogo="
				+ companyLogo + "]";
	}

}