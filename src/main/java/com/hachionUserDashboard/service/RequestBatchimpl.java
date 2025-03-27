package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;

import Service.RequestBatchService;

@Service
public class RequestBatchimpl implements RequestBatchService {
	public String getUserById(Long id) {
		return "User with ID: " + id;
}
}