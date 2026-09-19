package com.hachionUserDashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "course_tools_items")
public class ToolsItemEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "tools_name")
	private String toolsName;

	@Column(name = "tools_link")
	private String toolsLink;

	@Column(name = "image_name")
	private String imageName;

	@Column(name = "image_url")
	private String imageUrl;

	@ManyToOne
	@JoinColumn(name = "curr_id", nullable = false)
	private ToolsEntity tools;

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

	public ToolsEntity getTools() {
		return tools;
	}

	public void setTools(ToolsEntity tools) {
		this.tools = tools;
	}

}
