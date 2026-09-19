package com.hachionUserDashboard.dto;

public class ToolDetailsResponse {

	private String toolsName;
	private String toolsLink;
	private String imageName;
	private String imageUrl;

	private String categoryName;
	private String courseName;

	public String getToolsName() {
		return toolsName;
	}

	public void setToolsName(String toolsName) {
		this.toolsName = toolsName;
	}

	public String getToolsLink() {
		return toolsLink;
	}

	public void setToolsLink(String toolsLink) {
		this.toolsLink = toolsLink;
	}

	public String getImageName() {
		return imageName;
	}

	public void setImageName(String imageName) {
		this.imageName = imageName;
	}

	public String getImageUrl() {
		return imageUrl;
	}

	public void setImageUrl(String imageUrl) {
		this.imageUrl = imageUrl;
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

}