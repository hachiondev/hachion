package com.hachionUserDashboard.dto;

public class CertificateRequest {
	private String studentId;
	private String studentName;
	private String studentEmail;
	private String courseName;
	private String completionDate;
	private String status;

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

	public String getStudentEmail() {
		return studentEmail;
	}

	public void setStudentEmail(String studentEmail) {
		this.studentEmail = studentEmail;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public String getCompletionDate() {
		return completionDate;
	}

	public void setCompletionDate(String completionDate) {
		this.completionDate = completionDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public CertificateRequest(String studentId, String studentName, String studentEmail, String courseName,
			String completionDate, String status) {
		super();
		this.studentId = studentId;
		this.studentName = studentName;
		this.studentEmail = studentEmail;
		this.courseName = courseName;
		this.completionDate = completionDate;
		this.status = status;
	}

	public CertificateRequest() {
		super();
		// TODO Auto-generated constructor stub
	}

}
