package com.hachionUserDashboard.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "upload_images_category")
public class UploadImagesCategory {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "upload_images_category_id")
	private Long uploadImagesCategoryId;

	@Column(name = "category_name")
	private String categoryName;

	@Column(name = "course_name")
	private String courseName;

	@Column(name = "created_date")
	private LocalDate createdDate;

	@OneToMany(mappedBy = "uploadImagesCategory", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<UploadAllImages> images = new ArrayList<>();

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

	public List<UploadAllImages> getImages() {
		return images;
	}

	public void setImages(List<UploadAllImages> images) {
		this.images = images;
	}

}