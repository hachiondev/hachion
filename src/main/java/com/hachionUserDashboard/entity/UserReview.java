package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;

@JsonIgnoreProperties(ignoreUnknown = true)
@Entity
@Table(name = "userreview")
public class UserReview {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private int review_id;

	@Column
	private String name;

	@Column
	private String email;

	@Column
	private String status;

	@Lob
	private String user_image;

	@Column
	private boolean type;

	@Column
	private String course_name;

	
	@Column(name = "category_name")
	private String categoryName;
	
	
	@Column
	private String trainer_name;

	@Column
	private String social_id;

	@Column
	private Double rating;

	@Lob
	@Column(nullable = true, columnDefinition = "LONGTEXT")
	private String review;

	@Column(name = "review_type")
	private String reviewType;

	@Column
	private String location;

	@Column(name = "date") // Make sure the name matches your SQL column
	private LocalDate date;

	@Column
	private String display;

	@Column(nullable = true, name = "video_link", columnDefinition = "TEXT")
	private String videoLink;

	public UserReview() {
	}

	public int getReview_id() {
		return review_id;
	}

	public void setReview_id(int review_id) {
		this.review_id = review_id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getLocation() {
		return location;
	}

	public void setLocation(String location) {
		this.location = location;
	}

	public UserReview(String user_image) {
		super();
		this.user_image = user_image;
	}

	public String getUser_image() {
		return user_image;
	}

	public void setUser_image(String user_image) {
		this.user_image = user_image;
	}

	public boolean isType() {
		return type;
	}

	public void setType(boolean type) {
		this.type = type;
	}

	public String getCourse_name() {
		return course_name;
	}

	public void setCourse_name(String course_name) {
		this.course_name = course_name;
	}

	public String getTrainer_name() {
		return trainer_name;
	}

	public String getDisplay() {
		return display;
	}

	public void setDisplay(String display) {
		this.display = display;
	}

	public void setTrainer_name(String trainer_name) {
		this.trainer_name = trainer_name;
	}

	public String getSocial_id() {
		return social_id;
	}

	public void setSocial_id(String social_id) {
		this.social_id = social_id;
	}

	public Double getRating() {
		return rating;
	}

	public void setRating(Double rating) {
		this.rating = rating;
	}

	public String getReview() {
		return review;
	}

	public void setReview(String review) {
		this.review = review;
	}

	public LocalDate getDate() {
		return date;
	}

	public void setDate(LocalDate date) {
		this.date = date;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getVideoLink() {
		return videoLink;
	}

	public void setVideoLink(String videoLink) {
		this.videoLink = videoLink;
	}

	public String getReviewType() {
		return reviewType;
	}

	public void setReviewType(String reviewType) {
		this.reviewType = reviewType;
	}

	public String getCategoryName() {
		return categoryName;
	}

	public void setCategoryName(String categoryName) {
		this.categoryName = categoryName;
	}

}
