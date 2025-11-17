package com.hachionUserDashboard.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.dataformat.xml.XmlMapper;
import com.hachionUserDashboard.dto.VitelRecords;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class VitelClient {

	@Value("${vitel.baseUrl}")
	private String baseUrl;

	@Value("${vitel.username}")
	private String username;

	@Value("${vitel.password}")
	private String password;

	private final RestTemplate rest = new RestTemplate();
	private final XmlMapper xmlMapper = new XmlMapper();

	public VitelRecords fetchFor(String extension, LocalDate day) {
		

		if (baseUrl == null || baseUrl.isBlank()) {
			throw new IllegalStateException("vitel.baseUrl is not configured");
		}

		String url = UriComponentsBuilder.fromHttpUrl(baseUrl).queryParam("username", username)
				.queryParam("password", password).queryParam("line", extension).queryParam("startdate", day.toString())
				.queryParam("enddate", day.toString())

				.toUriString();

		

		String xml = rest.getForObject(url, String.class);

		

		
		if (xml != null) {
			
		}
		try {
			return xmlMapper.readValue(xml, VitelRecords.class);
		} catch (Exception e) {
			throw new RuntimeException("Failed to parse Vitel XML", e);
		}
	}
}
