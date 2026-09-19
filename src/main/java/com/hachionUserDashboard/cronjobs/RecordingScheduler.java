package com.hachionUserDashboard.cronjobs;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.hachionUserDashboard.repository.ProcessedRecordingRepository;
import com.hachionUserDashboard.service.RecordingService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RecordingScheduler {

	@Autowired
	private RecordingService recordingService;

	@Autowired
	private ProcessedRecordingRepository processedRepo;

//	@Scheduled(fixedRate = 300000) // every 5 minutes
    @Scheduled(fixedRate = 900000) // every 15 minutes
//	@Scheduled(fixedRate = 60000) // 1 minute
	public void run() {
		try {
			System.out.println("Running recording scheduler...");
			recordingService.processRecordings();
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

//	@Scheduled(cron = "0 0 13 * * *", zone = "Asia/Kolkata")
	public void cleanProcessedRecordings() {
		System.out.println("Cleaning processed_recording table...");
		processedRepo.deleteAll();
		System.out.println("Cleanup completed!");
	}
}