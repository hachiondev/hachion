package com.hachionUserDashboard.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Component;

@Component
public class ClickCache {

	private Map<String, Integer> clickMap = new HashMap<>();

	public int getPrevious(String link) {
		return clickMap.getOrDefault(link, 0);
	}

	public void update(String link, int count) {
		clickMap.put(link, count);
	}
}