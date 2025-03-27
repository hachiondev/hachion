package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;

import Service.ResumeService;


@Service
public class Resumeimp implements ResumeService {
	public String getUserById(Long id) {
		return "User with ID: " + id;
	}

}
