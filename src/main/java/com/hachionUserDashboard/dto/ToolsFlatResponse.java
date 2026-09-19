package com.hachionUserDashboard.dto;

import java.time.LocalDate;

public class ToolsFlatResponse {

	private Long currId;
	private String category_name;
	private String courseName;
	private LocalDate createdDate;

	private Long id; // tool item id
	private String toolsName;
	private String toolsLink;
	private String imageName;
	private String imageUrl;

	public Long getCurrId() {
		return currId;
	}

	public void setCurrId(Long currId) {
		this.currId = currId;
	}

	public String getCategory_name() {
		return category_name;
	}

	public void setCategory_name(String category_name) {
		this.category_name = category_name;
	}

	public String getCourseName() {
		return courseName;
	}

	public void setCourseName(String courseName) {
		this.courseName = courseName;
	}

	public LocalDate getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDate createdDate) {
		this.createdDate = createdDate;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

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

}
