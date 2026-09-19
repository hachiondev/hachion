package com.hachionUserDashboard.dto;

import java.time.LocalDate;

public class StudentRemarkRequest {

	private String studentId;
	private String remark;
	private String callMadeOn;
	private String finalRemark;
	private String lastCallMadeOn;
	private String coordinator;
	private String callStatus;

	public String getStudentId() {
		return studentId;
	}

	public void setStudentId(String studentId) {
		this.studentId = studentId;
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

	public String getCallStatus() {
		return callStatus;
	}

	public void setCallStatus(String callStatus) {
		this.callStatus = callStatus;
	}

}