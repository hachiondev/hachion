package com.hachionUserDashboard.entity;

import java.math.BigDecimal;
import java.time.LocalDate;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "job_applications")
public class JobApplication {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "job_application_id")
	private Long jobApplicationId;

	// Personal Information

	@Column(name = "first_name", nullable = false)
	private String firstName;

	@Column(name = "last_name", nullable = false)
	private String lastName;

	@Column(name = "email", nullable = false)
	private String email;

	@Column(name = "phone", nullable = false)
	private String phone;

	@Column(name = "address", nullable = false)
	private String address;

	// Role Information

	@Column(name = "department", nullable = false)
	private String department;

	@Column(name = "position", nullable = false)
	private String position;

	@Column(name = "employment_type", nullable = false)
	private String employmentType;

	@Column(name = "expected_salary", nullable = false)
	private String expectedSalary;

	@Column(name = "start_date", nullable = false)
	private LocalDate startDate;

	// Professional Background
	@Column(name = "experience", nullable = false, precision = 4, scale = 1)
	private BigDecimal experience;

	@Column(name = "education", nullable = false)
	private String education;

	@Column(name = "skills", nullable = false, length = 1000)
	private String skills;

	@Column(name = "portfolio", nullable = false)
	private String portfolio;

	@Column(name = "linkedin", nullable = false)
	private String linkedin;

	@Column(name = "relocation", nullable = false)
	private String relocation;

	@Column(name = "notice_period", nullable = false)
	private String noticePeriod;

	// Resume File

	@Column(name = "resume_path", nullable = false)
	private String resumePath;

	@CreationTimestamp
	@Column(name = "created_at", updatable = false)
	private LocalDate createdAt;

	// Getters and Setters

	public String getFirstName() {
		return firstName;
	}

	public Long getJobApplicationId() {
		return jobApplicationId;
	}

	public void setJobApplicationId(Long jobApplicationId) {
		this.jobApplicationId = jobApplicationId;
	}



	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public String getDepartment() {
		return department;
	}

	public void setDepartment(String department) {
		this.department = department;
	}

	public String getPosition() {
		return position;
	}

	public void setPosition(String position) {
		this.position = position;
	}

	public String getEmploymentType() {
		return employmentType;
	}

	public void setEmploymentType(String employmentType) {
		this.employmentType = employmentType;
	}

	public String getExpectedSalary() {
		return expectedSalary;
	}

	public void setExpectedSalary(String expectedSalary) {
		this.expectedSalary = expectedSalary;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}


	public String getEducation() {
		return education;
	}

	public void setEducation(String education) {
		this.education = education;
	}

	public String getSkills() {
		return skills;
	}

	public void setSkills(String skills) {
		this.skills = skills;
	}

	public String getPortfolio() {
		return portfolio;
	}

	public void setPortfolio(String portfolio) {
		this.portfolio = portfolio;
	}

	public String getLinkedin() {
		return linkedin;
	}

	public void setLinkedin(String linkedin) {
		this.linkedin = linkedin;
	}

	public String getRelocation() {
		return relocation;
	}

	public void setRelocation(String relocation) {
		this.relocation = relocation;
	}

	public String getNoticePeriod() {
		return noticePeriod;
	}

	public void setNoticePeriod(String noticePeriod) {
		this.noticePeriod = noticePeriod;
	}

	public String getResumePath() {
		return resumePath;
	}

	public BigDecimal getExperience() {
		return experience;
	}

	public void setExperience(BigDecimal experience) {
		this.experience = experience;
	}

	public LocalDate getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDate createdAt) {
		this.createdAt = createdAt;
	}

	public void setResumePath(String resumePath) {
		this.resumePath = resumePath;
	}

	
}