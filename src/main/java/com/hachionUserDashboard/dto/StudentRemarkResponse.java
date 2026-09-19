package com.hachionUserDashboard.dto;

import java.time.LocalDate;

public class StudentRemarkResponse {

    private Long id;
    private String studentId;
    private String remark;
    private String callMadeOn;
    private String finalRemark;
    private String lastCallMadeOn;
    private String coordinator;
    private LocalDate createdAt;
    private String callStatus;

    // Getters & Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public LocalDate getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDate createdAt) {
        this.createdAt = createdAt;
    }

	public String getCallStatus() {
		return callStatus;
	}

	public void setCallStatus(String callStatus) {
		this.callStatus = callStatus;
	}
    
}