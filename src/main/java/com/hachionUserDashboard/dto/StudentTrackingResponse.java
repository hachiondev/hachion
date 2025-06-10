package com.hachionUserDashboard.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Table(name = "student_tracking")
public class StudentTrackingResponse {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long studentTrackingId;

	@Column(name = "student_name")
	private String studentName;

	@Column(name = "student_email")
	private String studentEmail;

	@Column(name = "mobile")
	private String mobile;

	@Column(name = "start_date")
	private String startDate;

	@Column(name = "completed_date")
	private String completedDate;

	@Column(name = "no.of_sessions")
	private int numberOfSessions;

	@Column(name = "completed_sessions")
	private int completedSessions;

	@Column(name = "batch_status")
	private String batchStatus;

	@Column(name = "remarks")
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

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getCompletedDate() {
		return completedDate;
	}

	public void setCompletedDate(String completedDate) {
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

}
