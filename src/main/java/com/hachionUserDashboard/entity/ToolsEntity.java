package com.hachionUserDashboard.entity;

import java.time.LocalDate;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

// category_name + course_name is meant to be a unique key - ToolsServiceImpl
// looks up "the" ToolsEntity for a category/course via a single-result query
// (ToolsRepository.findByCategoryNameAndCourseName), which throws
// IncorrectResultSizeDataAccessException ("Query did not return a unique
// result") if more than one row matches. This constraint makes that
// invariant enforced by the database, not just assumed by the code -
// without it, two near-simultaneous "Add Tool" requests for a
// category/course that doesn't have a row yet can each find nothing and
// both insert, silently creating exactly this kind of duplicate.
@Entity
@Table(name = "course_tools", uniqueConstraints = @UniqueConstraint(name = "uq_course_tools_category_course", columnNames = {
		"category_name", "course_name" }))
public class ToolsEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "curr_id")
	private Long currId;

	@Column(name = "category_name",nullable = false)
	private String categoryName;

	@Column(name = "course_name",nullable = false)
	private String courseName;

	@Column(name = "created_date", nullable = false)
	private LocalDate createdDate;

	@OneToMany(mappedBy = "tools", cascade = CascadeType.ALL, orphanRemoval = true)
	private List<ToolsItemEntity> items;

	// getters & setters

	public Long getCurrId() {
		return currId;
	}

	public void setCurrId(Long currId) {
		this.currId = currId;
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

	public List<ToolsItemEntity> getItems() {
		return items;
	}

	public void setItems(List<ToolsItemEntity> items) {
		this.items = items;
	}
}
