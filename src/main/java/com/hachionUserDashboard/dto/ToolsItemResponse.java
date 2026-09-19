package com.hachionUserDashboard.dto;

public class ToolsItemResponse {

	private Long id;
	private String toolsName;
	private String toolsLink;
	private String imageName;
	private String imageUrl;

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
