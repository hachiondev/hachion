package com.hachionUserDashboard.dto;

import java.time.LocalDate;

public class StudentTrackingResponse {


	private Long studentTrackingId;

	private String studentId;

	private String studentName;

	private String studentEmail;
	
	private String courseCategory;

	private String courseName;
	

	private String batchType;
	
	
	private String batchId;

	private String mobile;

	private LocalDate startDate;

	private LocalDate completedDate;

	private int numberOfSessions;

	private int completedSessions;

	private String batchStatus;

	private String remarks;

	public Long getStudentTrackingId() {
		return studentTrackingId;
	}

	public void setStudentTrackingId(Long studentTrackingId) {
		this.studentTrackingId = studentTrackingId;
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

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public LocalDate getStartDate() {
		return startDate;
	}

	public void setStartDate(LocalDate startDate) {
		this.startDate = startDate;
	}

	public LocalDate getCompletedDate() {
		return completedDate;
	}

	public void setCompletedDate(LocalDate completedDate) {
		this.completedDate = completedDate;
	}

	public int getNumberOfSessions() {
		return numberOfSessions;
	}

	public void setNumberOfSessions(int numberOfSessions) {
		this.numberOfSessions = numberOfSessions;
	}

	public int getCompletedSessions() {
		return completedSessions;
	}

	public void setCompletedSessions(int completedSessions) {
		this.completedSessions = completedSessions;
	}

	public String getBatchStatus() {
		return batchStatus;
	}

	public void setBatchStatus(String batchStatus) {
		this.batchStatus = batchStatus;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public String getCourseCategory() {
		return courseCategory;
	}

	public void setCourseCategory(String courseCategory) {
		this.courseCategory = courseCategory;
	}

	public String getBatchId() {
		return batchId;
	}

	public void setBatchId(String batchId) {
		this.batchId = batchId;
	}

	public String getBatchType() {
		return batchType;
	}

	public void setBatchType(String batchType) {
		this.batchType = batchType;
	}

}
