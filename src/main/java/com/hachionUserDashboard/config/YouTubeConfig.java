package com.hachionUserDashboard.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestClient;

@Configuration
public class YouTubeConfig {

	@Value("${youtube.api.key}")
	private String apiKey;

	@Bean
	public RestClient restClient() {
		return RestClient.create();
	}

	@Bean
	public String youtubeApiKey() {
		return apiKey;
	}
}