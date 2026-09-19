package com.hachionUserDashboard.dto;

public class ProjectCourseViewResponse {

	private String projectName;
	private String description;

	public ProjectCourseViewResponse(String projectName, String description) {
		this.projectName = projectName;
		this.description = description;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

}
