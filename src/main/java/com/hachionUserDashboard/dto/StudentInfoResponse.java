package com.hachionUserDashboard.dto;

public class StudentInfoResponse {

	private String userName;
	private String studentId;
	private String email;

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
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

	public StudentInfoResponse(String userName, String studentId, String email) {
		super();
		this.userName = userName;
		this.studentId = studentId;
		this.email = email;
	}

	public StudentInfoResponse() {
		super();
		// TODO Auto-generated constructor stub
	}

}
