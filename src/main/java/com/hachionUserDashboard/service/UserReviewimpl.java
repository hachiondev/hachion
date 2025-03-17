package com.hachionUserDashboard.service;

import Service.UserReviewService;

public class UserReviewimpl implements UserReviewService{
	public String getUserById(Long id) {
		return "User with ID: " + id;
}
}