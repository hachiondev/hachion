package com.hachionUserDashboard.entity;

import java.time.LocalDate;

import jakarta.persistence.*;


@Entity
@Table(name = "user_wishlist", uniqueConstraints = @UniqueConstraint(columnNames = { "email", "course_id" }))
public class UserWishlist {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_wishlist_id", nullable = false)
	private Long userWishlistId;

	@Column(nullable = false)
	private String email;
	@Column(name = "course_id", nullable = false)
	private Integer courseId;

	@Column(name = "created_at", nullable = false)
	private LocalDate createdAt = LocalDate.now();

	public UserWishlist() {
	}

	public UserWishlist(String email, Integer courseId) {
		this.email = email;
		this.courseId = courseId;
		this.createdAt = LocalDate.now();
	}

	public String getEmail() {
		return email;
	}

	public Long getUserWishlistId() {
		return userWishlistId;
	}

	public void setUserWishlistId(Long userWishlistId) {
		this.userWishlistId = userWishlistId;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public Integer getCourseId() {
		return courseId;
	}

	public void setCourseId(Integer courseId) {
		this.courseId = courseId;
	}

	public LocalDate getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDate createdAt) {
		this.createdAt = createdAt;
	}
}
