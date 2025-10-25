package com.hachionUserDashboard.dto;

import java.time.LocalDate;

public class UploadAllImagesResponse {
	private Long uploadImagesCategoryId;
	private String categoryName;
	private String courseName;
	private LocalDate createdDate;
	private String fileName;
	private String originalFileName;
	private String fileUrl;

	public Long getUploadImagesCategoryId() {
		return uploadImagesCategoryId;
	}

	public void setUploadImagesCategoryId(Long uploadImagesCategoryId) {
		this.uploadImagesCategoryId = uploadImagesCategoryId;
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

	public LocalDate getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(LocalDate createdDate) {
		this.createdDate = createdDate;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getFileUrl() {
		return fileUrl;
	}

	public void setFileUrl(String fileUrl) {
		this.fileUrl = fileUrl;
	}

	public String getOriginalFileName() {
		return originalFileName;
	}

	public void setOriginalFileName(String originalFileName) {
		this.originalFileName = originalFileName;
	}
	

}