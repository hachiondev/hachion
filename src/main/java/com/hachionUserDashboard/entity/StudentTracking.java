package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "student_tracking")
public class StudentTracking {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "student_Tracking_id")
	private Long studentTrackingId;

	
	@Column(name = "student_id", nullable = true)
	private String studentId;
	
	
	@Column(name = "student_name")
	private String studentName;

	@Column(name = "student_email")
	private String studentEmail;
	
	@Column(name = "course_category")
	private String courseCategory;

	
	@Column(name="course_name")
	private String courseName;
	
	@Column(name="batch_type")
	private String batchType;
	
	
	@Column(name = "batch_id")
	private String batchId;
	
	@Column(name = "mobile")
	private String mobile;

	@Column(name = "start_date")
	private LocalDate startDate;

	@Column(name = "completed_date")
	private LocalDate completedDate;

	@Column(name = "no_of_sessions")
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
