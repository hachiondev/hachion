//package com.hachionUserDashboard.entity;
//
//import jakarta.persistence.Entity;
//import jakarta.persistence.GeneratedValue;
//import jakarta.persistence.GenerationType;
//import jakarta.persistence.Id;
//
//@Entity
//public class Admin {
//
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String username;
//    private String email;
//    private String password;  // Secure the password with encryption
//
//    // Getters and Setters
//    public Long getId() {
//        return id;
//    }
//
//    public String getEmail() {
//		return email;
//	}
//
//	public void setEmail(String email) {
//		this.email = email;
//	}
//
//	public void setId(Long id) {
//        this.id = id;
//    }
//
//    public String getUsername() {
//        return username;
//    }
//
//    public void setUsername(String username) {
//        this.username = username;
//    }
//
//    public String getPassword() {
//        return password;
//    }
//
//    public void setPassword(String password) {
//        this.password = password;
//    }
//}
package com.hachionUserDashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "kids_summer_training")
public class KidsSummerTrainingEntity {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long kidsSummerTrainingId;

	@Column(name = "full_name", nullable = false)
	private String fullName;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "mobile_number", nullable = false, unique = true)
	private String mobileNumber;

	@Column(name = "country", nullable = false)
	private String country;

	@Column(name = "course_interested", nullable = false)
	private String course_interested;

	@Column(name = "batch_timing", nullable = false)
	private String batchTiming;

	public Long getKidsSummerTrainingId() {
		return kidsSummerTrainingId;
	}

	public void setKidsSummerTrainingId(Long kidsSummerTrainingId) {
		this.kidsSummerTrainingId = kidsSummerTrainingId;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobileNumber() {
		return mobileNumber;
	}

	public void setMobileNumber(String mobileNumber) {
		this.mobileNumber = mobileNumber;
	}

	public String getCountry() {
		return country;
	}

	public void setCountry(String country) {
		this.country = country;
	}

	public String getCourse_interested() {
		return course_interested;
	}

	public void setCourse_interested(String course_interested) {
		this.course_interested = course_interested;
	}

	public String getBatchTiming() {
		return batchTiming;
	}

	public void setBatchTiming(String batchTiming) {
		this.batchTiming = batchTiming;
	}

	public KidsSummerTrainingEntity(Long kidsSummerTrainingId, String fullName, String email, String mobileNumber,
			String country, String course_interested, String batchTiming) {
		super();
		this.kidsSummerTrainingId = kidsSummerTrainingId;
		this.fullName = fullName;
		this.email = email;
		this.mobileNumber = mobileNumber;
		this.country = country;
		this.course_interested = course_interested;
		this.batchTiming = batchTiming;
	}

	public KidsSummerTrainingEntity() {
		super();
		// TODO Auto-generated constructor stub
	}

}