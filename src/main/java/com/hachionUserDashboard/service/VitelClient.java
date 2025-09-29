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
		System.out.println("baseUrl=" + baseUrl + ", user=" + username);

		if (baseUrl == null || baseUrl.isBlank()) {
			throw new IllegalStateException("vitel.baseUrl is not configured");
		}

		String url = UriComponentsBuilder.fromHttpUrl(baseUrl).queryParam("username", username)
				.queryParam("password", password).queryParam("line", extension).queryParam("startdate", day.toString())
				.queryParam("enddate", day.toString())

				.toUriString();

		System.out.println("Calling Vitel API: " + url);

		String xml = rest.getForObject(url, String.class);

		System.out.println("📥 Raw XML from Vitel:\n" + xml);

		System.out.println("Vitel XML length=" + (xml == null ? 0 : xml.length()));
		if (xml != null) {
			System.out.println("Vitel XML head:\n" + xml.substring(0, Math.min(800, xml.length())));
		}
		try {
			return xmlMapper.readValue(xml, VitelRecords.class);
		} catch (Exception e) {
			throw new RuntimeException("Failed to parse Vitel XML", e);
		}
	}
}
