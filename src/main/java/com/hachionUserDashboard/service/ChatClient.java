package com.hachionUserDashboard.service;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hachionUserDashboard.config.ChatProps;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatClient {

	@Autowired
	private ChatProps props;

	@Autowired
	private RestTemplate rest = new RestTemplate();

	public void postPlainText(String text) {
		HttpHeaders headers = new HttpHeaders();
		headers.setContentType(MediaType.APPLICATION_JSON); // force JSON
		headers.setAccept(List.of(MediaType.APPLICATION_JSON)); // prefer JSON

		Map<String, Object> body = Map.of("text", text);
		HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

		ResponseEntity<String> res = rest.exchange(props.getWebhookUrl(), HttpMethod.POST, entity, String.class);

		System.out.println("Chat response: " + res.getStatusCode() + " body=" + res.getBody());
		if (!res.getStatusCode().is2xxSuccessful()) {
			throw new RuntimeException("Google Chat post failed: " + res.getStatusCode());
		}
	}

}