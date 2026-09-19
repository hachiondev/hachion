package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "student_remarks_history")
public class StudentRemarksHistory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "remark", columnDefinition = "TEXT")
	private String remark;

	@Column(name = "call_made_on")
	private String callMadeOn;

	@Column(name = "final_remark",columnDefinition = "TEXT")
	private String finalRemark;

	@Column(name = "last_call_made_on")
	private String lastCallMadeOn;

	@Column(name = "co_ordinator")
	private String coordinator;

	@Column(name = "created_at")
	private LocalDate createdAt;
	
	@Column(name = "call_status")
	private String callStatus;

	@ManyToOne
	@JoinColumn(name = "student_id", referencedColumnName = "student_id")
	private RegisterStudent student;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getCallMadeOn() {
		return callMadeOn;
	}

	public void setCallMadeOn(String callMadeOn) {
		this.callMadeOn = callMadeOn;
	}

	public String getFinalRemark() {
		return finalRemark;
	}

	public void setFinalRemark(String finalRemark) {
		this.finalRemark = finalRemark;
	}

	public String getLastCallMadeOn() {
		return lastCallMadeOn;
	}

	public void setLastCallMadeOn(String lastCallMadeOn) {
		this.lastCallMadeOn = lastCallMadeOn;
	}

	public String getCoordinator() {
		return coordinator;
	}

	public void setCoordinator(String coordinator) {
		this.coordinator = coordinator;
	}

	public LocalDate getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDate createdAt) {
		this.createdAt = createdAt;
	}

	public RegisterStudent getStudent() {
		return student;
	}

	public void setStudent(RegisterStudent student) {
		this.student = student;
	}

	public String getCallStatus() {
		return callStatus;
	}

	public void setCallStatus(String callStatus) {
		this.callStatus = callStatus;
	}

}