package com.hachionUserDashboard.dto;

import java.time.LocalDate;


public class ApplyJobDetailsRequest {

	private Long applyJobDetailsId;

	private String jobId;

	private String studentName;

	private String email;

	private String mobileNumber;

	private String companyLogo;

	private String companyName;

	private String jobTitle;

	private LocalDate date;

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
