package com.hachionUserDashboard.dto;

import java.time.LocalDate;
import java.util.List;

public class PopupOnboardingResponse {

	private Long popupOnboardingId;

	private String studentId;

	private String studentName;

	private String studentEmail;

	private String mobile;

	private String currentRole;

	private String primaryGoal;

	private String areasOfInterest;

	private List<String> preferToLearn;

	private String preferredTrainingMode;

	private String currentSkill;

	private String lookingForJob;

	private String realTimeProjects;

	private String certificationOrPlacement;

	private String speakToCourseAdvisor;

	private String whereYouHeard;

	private LocalDate fillingDate;

	public Long getPopupOnboardingId() {
		return popupOnboardingId;
	}

	public void setPopupOnboardingId(Long popupOnboardingId) {
		this.popupOnboardingId = popupOnboardingId;
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

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getCurrentRole() {
		return currentRole;
	}

	public void setCurrentRole(String currentRole) {
		this.currentRole = currentRole;
	}

	public String getPrimaryGoal() {
		return primaryGoal;
	}

	public void setPrimaryGoal(String primaryGoal) {
		this.primaryGoal = primaryGoal;
	}

	public String getAreasOfInterest() {
		return areasOfInterest;
	}

	public void setAreasOfInterest(String areasOfInterest) {
		this.areasOfInterest = areasOfInterest;
	}

	public List<String> getPreferToLearn() {
		return preferToLearn;
	}

	public void setPreferToLearn(List<String> preferToLearn) {
		this.preferToLearn = preferToLearn;
	}

	public String getPreferredTrainingMode() {
		return preferredTrainingMode;
	}

	public void setPreferredTrainingMode(String preferredTrainingMode) {
		this.preferredTrainingMode = preferredTrainingMode;
	}

	public String getCurrentSkill() {
		return currentSkill;
	}

	public void setCurrentSkill(String currentSkill) {
		this.currentSkill = currentSkill;
	}

	public String getLookingForJob() {
		return lookingForJob;
	}

	public void setLookingForJob(String lookingForJob) {
		this.lookingForJob = lookingForJob;
	}

	public String getRealTimeProjects() {
		return realTimeProjects;
	}

	public void setRealTimeProjects(String realTimeProjects) {
		this.realTimeProjects = realTimeProjects;
	}

	public String getCertificationOrPlacement() {
		return certificationOrPlacement;
	}

	public void setCertificationOrPlacement(String certificationOrPlacement) {
		this.certificationOrPlacement = certificationOrPlacement;
	}

	public String getSpeakToCourseAdvisor() {
		return speakToCourseAdvisor;
	}

	public void setSpeakToCourseAdvisor(String speakToCourseAdvisor) {
		this.speakToCourseAdvisor = speakToCourseAdvisor;
	}

	public String getWhereYouHeard() {
		return whereYouHeard;
	}

	public void setWhereYouHeard(String whereYouHeard) {
		this.whereYouHeard = whereYouHeard;
	}

	public LocalDate getFillingDate() {
		return fillingDate;
	}

	public void setFillingDate(LocalDate fillingDate) {
		this.fillingDate = fillingDate;
	}

}
