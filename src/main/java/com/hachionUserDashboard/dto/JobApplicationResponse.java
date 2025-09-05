package com.hachionUserDashboard.dto;

import java.time.LocalDate;

public class JobApplicationResponse {

	private String companyLogo;
	private String companyName;
	private String jobTitle;
	private String jobId;
	private LocalDate date;

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

	public String getJobId() {
		return jobId;
	}

	public void setJobId(String jobId) {
		this.jobId = jobId;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}
	  public JobApplicationResponse(String companyLogo, String companyName, String jobTitle, String jobId, LocalDate date) {
	        this.companyLogo = companyLogo;
	        this.companyName = companyName;
	        this.jobTitle = jobTitle;
	        this.jobId = jobId;
	        this.date = date;
	    }

}
