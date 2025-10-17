package com.hachionUserDashboard.entity;

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

	@Column
	private String name;

	@Column(name = "student_id")
	private String studentId;

	@Column(name = "batch_id")
	private String batchId;

	@Column
	private String email;

	@Column
	private String mobile;

	@Column
	private String course_name;

	@Column
	private String enroll_date;
	@Column
	private String week;

	@Column
	private String time;
	@Column
	private String amount;

	@Column
	private String mode;

	@Column
	private String type;

	@Column
	private String trainer;

	@Column
	private String completion_date;

	@Column
	private String meeting_link;

	public int getResendCount() {
		return resendCount;
	}

	public void setResendCount(int resendCount) {
		this.resendCount = resendCount;
	}

	@Column(name = "resend_count")
	private int resendCount = 0;

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

	public String getAmount() {
		return amount;
	}

	public void setAmount(String amount) {
		this.amount = amount;
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

	public String getCompletion_date() {
		return completion_date;
	}

	public void setCompletion_date(String completion_date) {
		this.completion_date = completion_date;
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
				+ ", trainer=" + trainer + ", completion_date=" + completion_date + ", meeting_link=" + meeting_link
				+ ", resendCount=" + resendCount + "]";
	}

	public Enroll(int id, String name, String studentId, String batchId, String email, String mobile,
			String course_name, String enroll_date, String week, String time, String amount, String mode, String type,
			String trainer, String completion_date, String meeting_link, int resendCount) {
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
		this.completion_date = completion_date;
		this.meeting_link = meeting_link;
		this.resendCount = resendCount;
	}

}
