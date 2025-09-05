package com.hachionUserDashboard.entity;

import java.time.LocalDate;
import java.util.List;

import com.hachionUserDashboard.service.StringListConverter;

import jakarta.persistence.Column;
import jakarta.persistence.Convert;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "popup_onboarding")
public class PopupOnboarding {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "popup_onboarding_id")
	private Long popupOnboardingId;

	@Column(name = "student_id")
	private String studentId;

	@Column(name = "student_name")
	private String studentName;

	@Column(name = "student_email")
	private String studentEmail;

	@Column(name = "mobile")
	private String mobile;

	@Column(name = "current_role")
	private String currentRole;

	@Column(name = "primary_goal")
	private String primaryGoal;

	@Column(name = "areas_of_interest")
	private String areasOfInterest;

	@Column(name = "prefer_to_learn")
	@Convert(converter = StringListConverter.class)
	private List<String> preferToLearn;

	@Column(name = "preferred_training_mode")
	private String preferredTrainingMode;

	@Column(name = "current_skill")
	private String currentSkill;

	@Column(name = "looking_for_job")
	private String lookingForJob;

	@Column(name = "real_time_projects")
	private String realTimeProjects;

	@Column(name = "certification_or_placement")
	private String certificationOrPlacement;

	@Column(name = "speak_to_course_advisor")
	private String speakToCourseAdvisor;

	@Column(name = "where_you_heard")
	private String whereYouHeard;

	@Column(name = "filling_date")
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
