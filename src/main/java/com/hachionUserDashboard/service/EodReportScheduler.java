package com.hachionUserDashboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EodReportScheduler {

	@Autowired
	private EodReportService eod;

	@Scheduled(cron = "${eod.cron}", zone = "${eod.zone:UTC}")

	public void sendDailyEod() {
		System.out.println("[EOD Scheduler] fired at UTC " + java.time.Instant.now());
		eod.runEodForYesterday();
		System.out.println("[EOD Scheduler] fired at UTC " + java.time.Instant.now());

	}

}
