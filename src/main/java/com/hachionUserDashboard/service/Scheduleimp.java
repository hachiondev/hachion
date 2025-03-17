package com.hachionUserDashboard.service;
import org.springframework.stereotype.Service;

import Service.Schedule;

@Service
public class Scheduleimp implements Schedule {
	public String getUserById(Long id) {
		return "User with ID: " + id;
	}

}
