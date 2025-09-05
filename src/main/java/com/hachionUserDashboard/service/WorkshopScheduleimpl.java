package com.hachionUserDashboard.service;


import Service.WorkshopSchedule;

public class WorkshopScheduleimpl implements WorkshopSchedule{
	public String getUserById(Long id) {
		return "User with ID: " + id;
	} 
}
