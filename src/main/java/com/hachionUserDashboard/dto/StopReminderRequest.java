package com.hachionUserDashboard.dto;

public class StopReminderRequest {

	private String stopReminder;
	private String courseName;
	private String studentId;
	private String email;

	public String getStopReminder() {
		return stopReminder;
	}

	public void setStopReminder(String stopReminder) {
		this.stopReminder = stopReminder;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}
}
