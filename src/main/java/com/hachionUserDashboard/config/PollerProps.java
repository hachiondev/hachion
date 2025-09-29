package com.hachionUserDashboard.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "poller")
@Data
public class PollerProps {
	private long fixedDelayMs = 60000;
}