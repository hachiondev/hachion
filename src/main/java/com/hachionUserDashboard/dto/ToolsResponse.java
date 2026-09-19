package com.hachionUserDashboard.dto;

import java.time.LocalDate;
import java.util.List;

public class ToolsResponse {

	private Long currId;
	private String category_name;
	private String courseName;
	private LocalDate createdDate;

	private List<ToolsItemResponse> tool_image;

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

	public List<ToolsItemResponse> getTool_image() {
		return tool_image;
	}

	public void setTool_image(List<ToolsItemResponse> tool_image) {
		this.tool_image = tool_image;
	}
}