package com.hachionUserDashboard.dto;

import java.util.List;

public class StudentCourseInfo {
	private String studentId;
	private String studentName;
	private String emailId;
	private String mobileNumber;
	private List<String> courses;

	
	public StudentCourseInfo(String studentId, String studentName, String emailId, String mobileNumber,
			List<String> courses) {
		this.studentId = studentId;
		this.studentName = studentName;
		this.emailId = emailId;
		this.mobileNumber = mobileNumber;
		this.courses = courses;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getStudentName() {
		return studentName;
	}

	public void setStudentName(String studentName) {
		this.studentName = studentName;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public List<String> getCourses() {
		return courses;
	}

	public void setCourses(List<String> courses) {
		this.courses = courses;
	}

}
