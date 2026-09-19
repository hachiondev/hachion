package com.hachionUserDashboard.dto;

import java.time.LocalDate;
import java.util.List;

public class GeoKeywordResponse {

	// Parent table fields
	private Long geoKeywordGroupId;
	private String categoryName;
	private String courseName;
	private LocalDate groupCreatedDate;

	// Child table fields
	private List<GeoKeywordItem> geoKeywords;

	public Long getGeoKeywordGroupId() {
		return geoKeywordGroupId;
	}

	public void setGeoKeywordGroupId(Long geoKeywordGroupId) {
		this.geoKeywordGroupId = geoKeywordGroupId;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public LocalDate getGroupCreatedDate() {
		return groupCreatedDate;
	}

	public void setGroupCreatedDate(LocalDate groupCreatedDate) {
		this.groupCreatedDate = groupCreatedDate;
	}

	public List<GeoKeywordItem> getGeoKeywords() {
		return geoKeywords;
	}

	public void setGeoKeywords(List<GeoKeywordItem> geoKeywords) {
		this.geoKeywords = geoKeywords;
	}

}