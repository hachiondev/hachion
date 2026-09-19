package com.hachionUserDashboard.config;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

// Dedicated pool for @Async WhatsApp/Twilio sends (WhatsAppService), kept
// separate from Spring's shared SimpleAsyncTaskExecutor default so a burst
// of enrollments/reminders can't starve other @Async work (or vice versa),
// and bounded so a stuck/slow Twilio endpoint can't spawn unbounded threads.
@Configuration
public class AsyncConfig {

	@Bean(name = "whatsappExecutor")
	public Executor whatsappExecutor() {
		ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
		executor.setCorePoolSize(4);
		executor.setMaxPoolSize(16);
		executor.setQueueCapacity(200);
		executor.setThreadNamePrefix("whatsapp-async-");
		executor.initialize();
		return executor;
	}
}
