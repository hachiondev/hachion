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
@Table(name = "apply_job_details")
public class ApplyJobDetails {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "apply_job_details_id")
	private Long applyJobDetailsId;

	@Column(name = "job_id")
	private String jobId;

	@Column(name = "student_name")
	private String studentName;

	@Column(name = "email")
	private String email;

	@Column(name = "mobile_number")
	private String mobileNumber;

	@Column(name = "company_logo")
	private String companyLogo;

	@Column(name = "company_name")
	private String companyName;

	@Column(name = "job_title")
	private String jobTitle;

	@Column(name = "date")
	private LocalDate date;

	@Column(name = "resume")
	private String resume;

	public Long getApplyJobDetailsId() {
		return applyJobDetailsId;
	}

	public void setApplyJobDetailsId(Long applyJobDetailsId) {
		this.applyJobDetailsId = applyJobDetailsId;
	}

	public String getJobId() {
		return jobId;
	}

	public void setJobId(String jobId) {
		this.jobId = jobId;
	}

	public String getStudentName() {
		return studentName;
	}

	public void setStudentName(String studentName) {
		this.studentName = studentName;
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

	public String getCompanyLogo() {
		return companyLogo;
	}

	public void setCompanyLogo(String companyLogo) {
		this.companyLogo = companyLogo;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public String getJobTitle() {
		return jobTitle;
	}

	public void setJobTitle(String jobTitle) {
		this.jobTitle = jobTitle;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getResume() {
		return resume;
	}

	public void setResume(String resume) {
		this.resume = resume;
	}

}
