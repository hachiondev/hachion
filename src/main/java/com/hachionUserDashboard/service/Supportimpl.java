package com.hachionUserDashboard.service;

import Service.SupportService;

public class Supportimpl implements SupportService {
	public String getUserById(Long id) {
		return "User with ID: " + id;
	} 

}
