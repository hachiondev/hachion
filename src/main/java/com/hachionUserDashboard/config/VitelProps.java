package com.hachionUserDashboard.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "vitel")

public class VitelProps {
	private String baseUrl;
	private String username;
	private String password;
	private String extensionsCsv;
	 private String recordsZone;


	public String getBaseUrl() {
		return baseUrl;
	}

	public void setBaseUrl(String baseUrl) {
		this.baseUrl = baseUrl;
	}

	public String getUsername() {
		return username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getExtensionsCsv() {
		return extensionsCsv;
	}

	public void setExtensionsCsv(String extensionsCsv) {
		this.extensionsCsv = extensionsCsv;
	}

	public String getRecordsZone() {
		return recordsZone;
	}

	public void setRecordsZone(String recordsZone) {
		this.recordsZone = recordsZone;
	}


}