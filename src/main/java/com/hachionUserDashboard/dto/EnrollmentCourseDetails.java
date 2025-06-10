package com.hachionUserDashboard.dto;

import java.util.List;

public class EnrollmentCourseDetails {

	private String email;
	private List<String> studentIds;
	private List<String> batchIds;

	public EnrollmentCourseDetails(String email2, List<String> studentIds2, List<String> batchIds2) {
		// TODO Auto-generated constructor stub
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public List<String> getStudentIds() {
		return studentIds;
	}

	public void setStudentIds(List<String> studentIds) {
		this.studentIds = studentIds;
	}

	public List<String> getBatchIds() {
		return batchIds;
	}

	public void setBatchIds(List<String> batchIds) {
		this.batchIds = batchIds;
	}

}
