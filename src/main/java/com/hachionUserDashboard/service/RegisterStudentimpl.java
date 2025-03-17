package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;

import Service.ResumeService;

@Service
public class RegisterStudentimpl implements ResumeService {
	public String getUserById(Long id) {
		return "User with ID: " + id;
	}
}