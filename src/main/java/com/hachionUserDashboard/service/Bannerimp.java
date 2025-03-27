package com.hachionUserDashboard.service;

import org.springframework.stereotype.Service;

import Service.BannerService;
import Service.BlogService;

@Service
public class Bannerimp implements BannerService {
	public String getUserById(Long id) {
		return "User with ID: " + id;
	}

}
