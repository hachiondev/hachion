package com.hachionUserDashboard.entity;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;


@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "certificate_details")
public class CertificateEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "certificate_id")
	private Long certificateId;

	@Column(name = "student_id")
	private String studentId;
	
	@Column(name = "student_name")
	private String studentName;
	
	@Column(name = "student_email")
	private String studentEmail;
	
	@Column(name = "course_name")
	private String courseName;
	
	@Column(name = "completion_date")
	private String completionDate;
	
	@Column(name = "status")
	private String status;
	
	@Column(name = "certificate_path")
	private String certificatePath;

	private LocalDateTime createdAt = LocalDateTime.now();

	public Long getCertificateId() {
		return certificateId;
	}

	public void setCertificateId(Long certificateId) {
		this.certificateId = certificateId;
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

	public String getCertificatePath() {
		return certificatePath;
	}

	public void setCertificatePath(String certificatePath) {
		this.certificatePath = certificatePath;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public CertificateEntity(Long certificateId, String studentId, String studentName, String studentEmail,
			String courseName, String completionDate, String status, String certificatePath, LocalDateTime createdAt) {
		super();
		this.certificateId = certificateId;
		this.studentId = studentId;
		this.studentName = studentName;
		this.studentEmail = studentEmail;
		this.courseName = courseName;
		this.completionDate = completionDate;
		this.status = status;
		this.certificatePath = certificatePath;
		this.createdAt = createdAt;
	}

	public CertificateEntity() {
		super();
		// TODO Auto-generated constructor stub
	}

}