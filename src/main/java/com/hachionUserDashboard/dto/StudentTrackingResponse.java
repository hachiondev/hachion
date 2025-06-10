package com.hachionUserDashboard.dto;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


public class StudentTrackingResponse {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long studentTrackingId;

	
	private String studentName;

	
	private String studentEmail;

	
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

}
