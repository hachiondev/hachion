package com.hachionUserDashboard.dto;

import java.time.LocalDateTime;

public class RegisterStudentResponseDTO {

	private Long id;
	private String studentId;
	private String email;
	private String course_name;
	private String mobile;
	private String whatsapp;
	private String userName;
	private String country;
	private String location;
	private String visaStatus;
	private String stateCity;
	private String coordinator;
	private String leadStatus;
	private String leadTag;
	private String date;
	

	// 👇 Child table fields
	private String remark;
	private String callMadeOn;
	private String lastCallMadeOn;
	private String remarkCoordinator;
	
	private String mode;
	private String timeZone;
	private String analystName;
	private String source;
	private String seoTeam;
	private String status;
	private LocalDateTime lastEmailSentAt;
	
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
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getCourse_name() {
		return course_name;
	}
	public void setCourse_name(String course_name) {
		this.course_name = course_name;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getWhatsapp() {
		return whatsapp;
	}
	public void setWhatsapp(String whatsapp) {
		this.whatsapp = whatsapp;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	public String getCountry() {
		return country;
	}
	public void setCountry(String country) {
		this.country = country;
	}
	public String getStateCity() {
		return stateCity;
	}
	public void setStateCity(String stateCity) {
		this.stateCity = stateCity;
	}
	public String getCoordinator() {
		return coordinator;
	}
	public void setCoordinator(String coordinator) {
		this.coordinator = coordinator;
	}
	public String getLeadStatus() {
		return leadStatus;
	}
	public void setLeadStatus(String leadStatus) {
		this.leadStatus = leadStatus;
	}
	public String getDate() {
		return date;
	}
	public void setDate(String date) {
		this.date = date;
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
	public String getLastCallMadeOn() {
		return lastCallMadeOn;
	}
	public void setLastCallMadeOn(String lastCallMadeOn) {
		this.lastCallMadeOn = lastCallMadeOn;
	}
	public String getRemarkCoordinator() {
		return remarkCoordinator;
	}
	public void setRemarkCoordinator(String remarkCoordinator) {
		this.remarkCoordinator = remarkCoordinator;
	}
	public String getMode() {
		return mode;
	}
	public void setMode(String mode) {
		this.mode = mode;
	}
	public String getTimeZone() {
		return timeZone;
	}
	public void setTimeZone(String timeZone) {
		this.timeZone = timeZone;
	}
	public String getAnalystName() {
		return analystName;
	}
	public void setAnalystName(String analystName) {
		this.analystName = analystName;
	}
	public String getSource() {
		return source;
	}
	public void setSource(String source) {
		this.source = source;
	}
	public String getSeoTeam() {
		return seoTeam;
	}
	public void setSeoTeam(String seoTeam) {
		this.seoTeam = seoTeam;
	}
	
	
	public String getStatus() {
		return status;
	}
	public void setStatus(String status) {
		this.status = status;
	}
	
//	public RegisterStudentResponseDTO(Long id, String studentId, String email, String course_name, String mobile,
//			String whatsapp, String userName, String country, String stateCity, String coordinator, String leadStatus,
//			String leadTag, String date, String remark, String callMadeOn, String lastCallMadeOn,
//			String remarkCoordinator, String mode, String timeZone, String analystName, String source, String seoTeam,
//			String status) {
//		super();
//		this.id = id;
//		this.studentId = studentId;
//		this.email = email;
//		this.course_name = course_name;
//		this.mobile = mobile;
//		this.whatsapp = whatsapp;
//		this.userName = userName;
//		this.country = country;
//		this.stateCity = stateCity;
//		this.coordinator = coordinator;
//		this.leadStatus = leadStatus;
//		this.leadTag = leadTag;
//		this.date = date;
//		this.remark = remark;
//		this.callMadeOn = callMadeOn;
//		this.lastCallMadeOn = lastCallMadeOn;
//		this.remarkCoordinator = remarkCoordinator;
//		this.mode = mode;
//		this.timeZone = timeZone;
//		this.analystName = analystName;
//		this.source = source;
//		this.seoTeam = seoTeam;
//		this.status = status;
//	}
	
	public String getLeadTag() {
		return leadTag;
	}
	public RegisterStudentResponseDTO(
	        Long id,
	        String studentId,
	        String email,
	        String course_name,
	        String mobile,
	        String whatsapp,
	        String userName,
	        String country,
	        String location,      // NEW
	        String visaStatus,    // NEW
	        String stateCity,
	        String coordinator,
	        String leadStatus,
	        String leadTag,
	        String date,
	        String remark,
	        String callMadeOn,
	        String lastCallMadeOn,
	        String remarkCoordinator,
	        String mode,
	        String timeZone,
	        String analystName,
	        String source,
	        String seoTeam,
	        String status,
	        LocalDateTime lastEmailSentAt
	) {
	    this.id = id;
	    this.studentId = studentId;
	    this.email = email;
	    this.course_name = course_name;
	    this.mobile = mobile;
	    this.whatsapp = whatsapp;
	    this.userName = userName;
	    this.country = country;

	    this.location = location;          // NEW
	    this.visaStatus = visaStatus;      // NEW

	    this.stateCity = stateCity;
	    this.coordinator = coordinator;
	    this.leadStatus = leadStatus;
	    this.leadTag = leadTag;
	    this.date = date;
	    this.remark = remark;
	    this.callMadeOn = callMadeOn;
	    this.lastCallMadeOn = lastCallMadeOn;
	    this.remarkCoordinator = remarkCoordinator;
	    this.mode = mode;
	    this.timeZone = timeZone;
	    this.analystName = analystName;
	    this.source = source;
	    this.seoTeam = seoTeam;
	    this.status = status;
	    this.lastEmailSentAt = lastEmailSentAt;
	}
	public void setLeadTag(String leadTag) {
		this.leadTag = leadTag;
	}
	public LocalDateTime getLastEmailSentAt() {
		return lastEmailSentAt;
	}
	public void setLastEmailSentAt(LocalDateTime lastEmailSentAt) {
		this.lastEmailSentAt = lastEmailSentAt;
	}
	public String getLocation() {
		return location;
	}
	public void setLocation(String location) {
		this.location = location;
	}
	public String getVisaStatus() {
		return visaStatus;
	}
	public void setVisaStatus(String visaStatus) {
		this.visaStatus = visaStatus;
	}
	
}