package com.hachionUserDashboard.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {
	@Bean
	public WebClient webClient() {
		// increase buffer in case of large responses
		ExchangeStrategies strategies = ExchangeStrategies.builder()
				.codecs(cfg -> cfg.defaultCodecs().maxInMemorySize(8 * 1024 * 1024)).build();
		return WebClient.builder().exchangeStrategies(strategies).build();
	}
}