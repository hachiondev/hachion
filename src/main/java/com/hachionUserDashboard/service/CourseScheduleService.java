package com.hachionUserDashboard.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.repository.CourseScheduleRepository;

@Service
public class CourseScheduleService {

	@Autowired
	private CourseScheduleRepository repository;

	public List<String> getBatchIds(String categoryName, String courseName, String duration) {

		int months = 1;

		if (duration.equalsIgnoreCase("1 month")) {
			months = 1;
		} else if (duration.equalsIgnoreCase("2 months")) {
			months = 2;
		} else if (duration.equalsIgnoreCase("3 months")) {
			months = 3;
		} else if (duration.equalsIgnoreCase("6 months")) {
			months = 6;
		} else if (duration.equalsIgnoreCase("1 year")) {
			months = 12;
		}

		return repository.getBatchIdsByDuration(categoryName, courseName, months);
	}
}