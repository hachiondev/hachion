package com.hachionUserDashboard.dto;

import java.util.List;

public class GeoKeywordRequest {
	private String categoryName;
	private String courseName;
	private List<String> geoKeywords;

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

	public List<String> getGeoKeywords() {
		return geoKeywords;
	}

	public void setGeoKeywords(List<String> geoKeywords) {
		this.geoKeywords = geoKeywords;
	}

}