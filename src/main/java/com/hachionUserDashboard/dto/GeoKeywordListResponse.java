package com.hachionUserDashboard.dto;

import java.time.LocalDate;

public class GeoKeywordListResponse {

	private Long geoKeywordGroupId;
	private String categoryName;
	private String courseName;
	private LocalDate groupCreatedDate;
	private Long geoKeywordId;
	private String geoKeywordName;

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

	public String getGeoKeywordName() {
		return geoKeywordName;
	}

	public void setGeoKeywordName(String geoKeywordName) {
		this.geoKeywordName = geoKeywordName;
	}

	public Long getGeoKeywordId() {
		return geoKeywordId;
	}

	public void setGeoKeywordId(Long geoKeywordId) {
		this.geoKeywordId = geoKeywordId;
	}

	public GeoKeywordListResponse(Long geoKeywordId, Long geoKeywordGroupId, String categoryName, String courseName,
			LocalDate groupCreatedDate, String geoKeywordName) {
		this.geoKeywordId = geoKeywordId;
		this.geoKeywordGroupId = geoKeywordGroupId;
		this.categoryName = categoryName;
		this.courseName = courseName;
		this.groupCreatedDate = groupCreatedDate;
		this.geoKeywordName = geoKeywordName;
	}

}