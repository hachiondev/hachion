package com.hachionUserDashboard.dto;

public class OfflineEnrollRequest {

	private String email;
	private String course_name;
	private String enroll_date;
	private String batch_id;

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getCourse_name() {
		return course_name;
	}

	public void setCourse_name(String course_name) {
		this.course_name = course_name;
	}

	public String getEnroll_date() {
		return enroll_date;
	}

	public void setEnroll_date(String enroll_date) {
		this.enroll_date = enroll_date;
	}

	public String getBatch_id() {
		return batch_id;
	}

	public void setBatch_id(String batch_id) {
		this.batch_id = batch_id;
	}

}
