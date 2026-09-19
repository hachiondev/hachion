package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "enroll")
public class Enroll {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int id;

	@Column(nullable = false)
	private String name;

	@Column(name = "student_id",nullable = false)
	private String studentId;

	@Column(name = "batch_id",nullable = false)
	private String batchId;

	@Column(nullable = false)
	private String email;

	@Column(nullable = false)
	private String mobile;

	@Column(nullable = false)
	private String course_name;

	@Column(nullable = false)
	private String enroll_date;
	
	@Column
	private String week;

	@Column
	private String time;

	@Column
	private Double amount = 0.0;

	@Column(nullable = false)
	private String mode;

	@Column
	private String type;

	@Column
	private String trainer;

	@Column(name = "completion_date")
	private String completionDate;

	@Column
	private String meeting_link;

	@Column(name = "resend_count")
	private int resendCount = 0;

	@Column(name = "payment_status")
	private String paymentStatus;

	private LocalDate date;

	@Column(name = "payment_date")
	private LocalDate paymentDate;
	
	@Column(name = "student_status")
	private String studentStatus;
	
	@Column(name = "enrollment_status")
	private String enrollmentStatus;

	public String getEnrollmentStatus() {
		return enrollmentStatus;
	}

	public void setEnrollmentStatus(String enrollmentStatus) {
		this.enrollmentStatus = enrollmentStatus;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public int getResendCount() {
		return resendCount;
	}

	public void setResendCount(int resendCount) {
		this.resendCount = resendCount;
	}

	public Enroll() {

	}

	public int getId() {
		return id;
	}

	public void setId(int id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getCourse_name() {
		return course_name;
	}

	public void setCourse_name(String course_name) {
		this.course_name = course_name;
	}

	public String getMeeting_link() {
		return meeting_link;
	}

	public void setMeeting_link(String meeting_link) {
		this.meeting_link = meeting_link;
	}

	public String getEnroll_date() {
		return enroll_date;
	}

	public void setEnroll_date(String enroll_date) {
		this.enroll_date = enroll_date;
	}

	public String getWeek() {
		return week;
	}

	public void setWeek(String week) {
		this.week = week;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
	}

	public Double getAmount() {
		return amount;
	}

	public void setAmount(Double amount) {
		this.amount = amount;
	}

	public String getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public String getMode() {
		return mode;
	}

	public void setMode(String mode) {
		this.mode = mode;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getTrainer() {
		return trainer;
	}

	public void setTrainer(String trainer) {
		this.trainer = trainer;
	}

	public String getCompletionDate() {
		return completionDate;
	}

	public void setCompletionDate(String completionDate) {
		this.completionDate = completionDate;
	}

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
	}

	public String getBatchId() {
		return batchId;
	}

	public void setBatchId(String batchId) {
		this.batchId = batchId;
	}

	@Override
	public String toString() {
		return "Enroll [id=" + id + ", name=" + name + ", studentId=" + studentId + ", batchId=" + batchId + ", email="
				+ email + ", mobile=" + mobile + ", course_name=" + course_name + ", enroll_date=" + enroll_date
				+ ", week=" + week + ", time=" + time + ", amount=" + amount + ", mode=" + mode + ", type=" + type
				+ ", trainer=" + trainer + ", completionDate=" + completionDate + ", meeting_link=" + meeting_link
				+ ", resendCount=" + resendCount + "]";
	}

	public Enroll(int id, String name, String studentId, String batchId, String email, String mobile,
			String course_name, String enroll_date, String week, String time, Double amount, String mode, String type,
			String trainer, String completionDate, String meeting_link, int resendCount) {
		super();
		this.id = id;
		this.name = name;
		this.studentId = studentId;
		this.batchId = batchId;
		this.email = email;
		this.mobile = mobile;
		this.course_name = course_name;
		this.enroll_date = enroll_date;
		this.week = week;
		this.time = time;
		this.amount = amount;
		this.mode = mode;
		this.type = type;
		this.trainer = trainer;
		this.completionDate = completionDate;
		this.meeting_link = meeting_link;
		this.resendCount = resendCount;
	}

	public LocalDate getPaymentDate() {
		return paymentDate;
	}

	public void setPaymentDate(LocalDate paymentDate) {
		this.paymentDate = paymentDate;
	}

	public String getStudentStatus() {
		return studentStatus;
	}

	public void setStudentStatus(String studentStatus) {
		this.studentStatus = studentStatus;
	}

}
