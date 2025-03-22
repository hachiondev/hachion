package com.hachionUserDashboard.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "users_workshop")
@Getter
@Setter
public class UsersWorkshop {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "full_name", nullable = false)
	private String fullName;

	@Column(name = "email_id", nullable = false)
	private String emailId;

	@Column(name = "mobile_number", nullable = false)
	private String mobileNumber;

	@Column(name = "time_zone", nullable = false)
	private String timeZone;

	@Column(name = "course_name", nullable = false)
	private String courseName;
}