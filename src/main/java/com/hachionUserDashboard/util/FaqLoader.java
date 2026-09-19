package com.hachionUserDashboard.util;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

public class FaqLoader {

	public static Map<String, String> loadFaq(String fileName) {
		Map<String, String> faqMap = new HashMap<>();

		try (BufferedReader reader = new BufferedReader(
				new InputStreamReader(FaqLoader.class.getClassLoader().getResourceAsStream(fileName)))) {

			String line;
			String question = null;
			while ((line = reader.readLine()) != null) {
				line = line.trim();
				if (line.startsWith("Q:")) {
					question = line.substring(2).trim().toLowerCase();
				} else if (line.startsWith("A:") && question != null) {
					String answer = line.substring(2).trim();
					faqMap.put(question, answer);
					question = null;
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
		}

		return faqMap;
	}
}