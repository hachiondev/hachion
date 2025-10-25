package com.hachionUserDashboard.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import Service.PaymentService;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableScheduling
class SchedulingConfig {
}

@Component
@RequiredArgsConstructor
class PaymentReminderCron {

	@Autowired
	private PaymentService paymentService;

//	@Scheduled(cron = "0 * * * * ?") // every minute
	@Scheduled(cron = "0 0 6 * * *")
	public void runDaily() {
		paymentService.sendAutoRemindersForTomorrowDue();
	}
}