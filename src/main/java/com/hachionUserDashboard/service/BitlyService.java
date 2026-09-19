package com.hachionUserDashboard.service;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

@Service
public class BitlyService {

	private final String ACCESS_TOKEN = "957973b70dc4cd9a11847b863fc1d9f9cc9f17a0";

	public int getClicks(String bitlink) {
		try {
			URL url = new URL("https://api-ssl.bitly.com/v4/bitlinks/"
					+ bitlink.replace("https://", "").replace("http://", "") + "/clicks/summary");

			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Authorization", "Bearer " + ACCESS_TOKEN);

			BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));

			StringBuilder response = new StringBuilder();
			String line;

			while ((line = reader.readLine()) != null) {
				response.append(line);
			}

			reader.close();

			JSONObject json = new JSONObject(response.toString());
			return json.getInt("total_clicks");

		} catch (Exception e) {
			e.printStackTrace();
		}
		return 0;
	}

	public Map<String, Integer> getReferrers(String bitlink) {

		Map<String, Integer> refMap = new HashMap<>();

		try {
			URL url = new URL("https://api-ssl.bitly.com/v4/bitlinks/"
					+ bitlink.replace("https://", "").replace("http://", "") + "/referrers");

			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Authorization", "Bearer " + ACCESS_TOKEN);

			BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));

			StringBuilder response = new StringBuilder();
			String line;

			while ((line = reader.readLine()) != null) {
				response.append(line);
			}

			reader.close();

			JSONObject json = new JSONObject(response.toString());

			JSONArray referrers = new JSONArray();

			if (json.has("metrics")) {
				referrers = json.getJSONArray("metrics");
			} else {
				return refMap;
			}

			for (int i = 0; i < referrers.length(); i++) {
				JSONObject obj = referrers.getJSONObject(i);

				// ✅ FIX: use "value" instead of "referrer"
				String ref = obj.optString("value", "unknown");
				int clicks = obj.optInt("clicks", 0);

				refMap.put(ref, clicks);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return refMap;
	}

	public Map<String, Integer> getCountries(String bitlink) {

		Map<String, Integer> countryMap = new HashMap<>();

		try {
			URL url = new URL("https://api-ssl.bitly.com/v4/bitlinks/"
					+ bitlink.replace("https://", "").replace("http://", "") + "/countries");

			HttpURLConnection conn = (HttpURLConnection) url.openConnection();
			conn.setRequestMethod("GET");
			conn.setRequestProperty("Authorization", "Bearer " + ACCESS_TOKEN);

			BufferedReader reader = new BufferedReader(new InputStreamReader(conn.getInputStream()));

			StringBuilder response = new StringBuilder();
			String line;

			while ((line = reader.readLine()) != null) {
				response.append(line);
			}

			reader.close();

			JSONObject json = new JSONObject(response.toString());

			JSONArray countries = new JSONArray();

			if (json.has("metrics")) {
				countries = json.getJSONArray("metrics");
			} else {
				return countryMap;
			}

			for (int i = 0; i < countries.length(); i++) {
				JSONObject obj = countries.getJSONObject(i);

				String country = obj.optString("value", "unknown");
				int clicks = obj.optInt("clicks", 0);

				countryMap.put(country, clicks);
			}

		} catch (Exception e) {
			e.printStackTrace();
		}

		return countryMap;
	}
}