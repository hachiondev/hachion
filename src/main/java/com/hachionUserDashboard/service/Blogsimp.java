package com.hachionUserDashboard.service;

import Service.BlogService;
import Service.CourseService;

public class Blogsimp implements BlogService {
	public String getUserById(Long id) {
		return "User with ID: " + id;
	}
}
