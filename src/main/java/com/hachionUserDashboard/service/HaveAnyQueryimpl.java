package com.hachionUserDashboard.service;

import Service.HaveAnyQueryService;

public class HaveAnyQueryimpl implements HaveAnyQueryService {

	@Override
	public String getUserById(Long id) {
		return "User with ID: " + id;
	}
}