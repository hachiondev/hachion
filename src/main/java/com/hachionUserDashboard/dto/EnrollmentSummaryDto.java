package com.hachionUserDashboard.dto;

public class EnrollmentSummaryDto {
	private String email;
	private long totalEnrolled;
	private String lastEnrollDate;
	private String lastCourseName;

	public EnrollmentSummaryDto() {
	}

	public EnrollmentSummaryDto(String email, long totalEnrolled, String lastEnrollDate, String lastCourseName) {
		super();
		this.email = email;
		this.totalEnrolled = totalEnrolled;
		this.lastEnrollDate = lastEnrollDate;
		this.lastCourseName = lastCourseName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public long getTotalEnrolled() {
		return totalEnrolled;
	}

	public void setTotalEnrolled(long totalEnrolled) {
		this.totalEnrolled = totalEnrolled;
	}

	public String getLastEnrollDate() {
		return lastEnrollDate;
	}

	public void setLastEnrollDate(String lastEnrollDate) {
		this.lastEnrollDate = lastEnrollDate;
	}

	public String getLastCourseName() {
		return lastCourseName;
	}

	public void setLastCourseName(String lastCourseName) {
		this.lastCourseName = lastCourseName;
	}

}