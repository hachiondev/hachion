package com.hachionUserDashboard.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ToolsRequest {

	private String category_name;
	private String courseName;
	private LocalDateTime date;

	private List<ToolsItemRequest> tool_image;

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

	public LocalDateTime getDate() {
		return date;
	}

	public void setDate(LocalDateTime date) {
		this.date = date;
	}

	public List<ToolsItemRequest> getTool_image() {
		return tool_image;
	}

	public void setTool_image(List<ToolsItemRequest> tool_image) {
		this.tool_image = tool_image;
	}
}