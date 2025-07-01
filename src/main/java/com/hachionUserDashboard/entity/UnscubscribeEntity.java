package com.hachionUserDashboard.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "unsubscribe")
public class UnscubscribeEntity {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "unsubscribe_id")
	private Long unsubscribeId;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = true)
	private String mobile;

	@Column(name = "user_name")
	private String userName;

	public Long getUnsubscribeId() {
		return unsubscribeId;
	}

	public void setUnsubscribeId(Long unsubscribeId) {
		this.unsubscribeId = unsubscribeId;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getMobile() {
		return mobile;
	}

	public void setMobile(String mobile) {
		this.mobile = mobile;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

}
