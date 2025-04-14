package com.hachionUserDashboard.service;


import Service.EnrollService;

public class Enrollimp implements EnrollService {
	public String getUserById(Long id) {
		return "User with ID: " + id;
	}
}
