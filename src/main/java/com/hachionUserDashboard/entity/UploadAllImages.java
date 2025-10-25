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
@Table(name = "upload_all_images")
public class UploadAllImages {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "upload_all_images_id")
	private Long uploadAllImagesId;

	@Column(name = "file_name")
	private String fileName;

	@Column(name = "file_url")
	private String fileUrl;

	@ManyToOne
	@JoinColumn(name = "upload_images_category_id")
	private UploadImagesCategory uploadImagesCategory;

	public Long getUploadAllImagesId() {
		return uploadAllImagesId;
	}

	public void setUploadAllImagesId(Long uploadAllImagesId) {
		this.uploadAllImagesId = uploadAllImagesId;
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

	public UploadImagesCategory getUploadImagesCategory() {
		return uploadImagesCategory;
	}

	public void setUploadImagesCategory(UploadImagesCategory uploadImagesCategory) {
		this.uploadImagesCategory = uploadImagesCategory;
	}

}