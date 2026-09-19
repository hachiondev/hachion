package com.hachionUserDashboard.cronjobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.hachionUserDashboard.service.DriveCleanupService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class DriveCleanupScheduler {

	@Autowired
	private DriveCleanupService cleanupService;

	// Every day at 2:00 PM IST
//	@Scheduled(cron = "0 0 14 * * *", zone = "Asia/Kolkata")
	public void runCleanup() {
		try {
			System.out.println("Starting Drive cleanup...");
			cleanupService.deleteOldRecordings();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
}