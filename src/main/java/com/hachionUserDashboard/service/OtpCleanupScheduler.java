package com.hachionUserDashboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hachionUserDashboard.repository.UserRepository;

@Service
public class OtpCleanupScheduler {

	@Autowired
	private UserRepository userRepository;

//	@Scheduled(cron = "0 0 0 * * ?") // runs 1 day
	@Scheduled(cron = "0 * * * * ?") //runs every 1 minute
//	@Scheduled(cron = "0 0 0 */7 * ?") //runs after 7 days 
	@Transactional
	public void deleteUnverifiedUsers() {
		int deletedRows = userRepository.deleteExpiredOtps();
		System.out.println(deletedRows + " unverified users deleted.");
	}
}
