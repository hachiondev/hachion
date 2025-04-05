package com.hachionUserDashboard.service;

import Service.CorporateCourseService;

public class CorporateCourseimpl implements CorporateCourseService {
	public String getUserById(Long id) {
		return "User with ID: " + id;
	}
}
