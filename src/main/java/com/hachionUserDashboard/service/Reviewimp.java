package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;

import Service.ResumeService;
import Service.ReviewService;


@Service
public class Reviewimp implements ReviewService {
	public String getUserById(Long id) {
		return "User with ID: " + id;
	}

}
