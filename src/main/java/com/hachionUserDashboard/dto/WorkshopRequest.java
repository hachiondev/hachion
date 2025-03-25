package com.hachionUserDashboard.dto;

import java.util.List;

//@AllArgsConstructor
//@NoArgsConstructor
public class WorkshopRequest {

	private Long workshopId;

	private List<String> courseName;
	private boolean isCourseNameUpdated;

	private String courseCategory;
	private boolean isCourseCategoryUpdated;

	private String date;
	private boolean isDateUpdated;

	private String time;
	private boolean isTimeUpdated;

	private String timeZone;
	private boolean isTimeZoneUpdated;

	private String fullName;
	private boolean isFullNameUpdated;

	private String emailId;
	private boolean isEmailIdUpdated;

	private String mobileNumber;
	private boolean isMobileNumberUpdated;

	public Long getWorkshopId() {
		return workshopId;
	}

	public void setWorkshopId(Long workshopId) {
		this.workshopId = workshopId;
	}

	public List<String> getCourseName() {
		return courseName;
	}

	public void setCourseName(List<String> courseName) {
		this.courseName = courseName;
		this.isCourseNameUpdated = true;
	}

	public boolean isCourseNameUpdated() {
		return isCourseNameUpdated;
	}

	public String getCourseCategory() {
		return courseCategory;
	}

	public void setCourseCategory(String courseCategory) {
		this.courseCategory = courseCategory;
		this.isCourseCategoryUpdated = true;
	}

	public boolean isCourseCategoryUpdated() {
		return isCourseCategoryUpdated;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
		this.isDateUpdated = true;
	}

	public boolean isDateUpdated() {
		return isDateUpdated;
	}

	public String getTime() {
		return time;
	}

	public void setTime(String time) {
		this.time = time;
		this.isTimeUpdated = true;
	}

	public boolean isTimeUpdated() {
		return isTimeUpdated;
	}

	public String getTimeZone() {
		return timeZone;
	}

	public void setTimeZone(String timeZone) {
		this.timeZone = timeZone;
		this.isTimeZoneUpdated = true;
	}

	public boolean isTimeZoneUpdated() {
		return isTimeZoneUpdated;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
		this.isFullNameUpdated = true;
	}

	public boolean isFullNameUpdated() {
		return isFullNameUpdated;
	}

	public String getEmailId() {
		return emailId;
	}

	public void setEmailId(String emailId) {
		this.emailId = emailId;
		this.isEmailIdUpdated = true;
	}

	public boolean isEmailIdUpdated() {
		return isEmailIdUpdated;
	}

	public void setEmailIdUpdated(boolean isEmailIdUpdated) {

	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
		this.isMobileNumberUpdated = true;
	}

	public boolean isMobileNumberUpdated() {
		return isMobileNumberUpdated;
	}

}
