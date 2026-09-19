
package com.hachionUserDashboard.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class BitlyScheduler {

	@Autowired
	private BitlyService bitlyService;

	@Autowired
	private WebhookSenderService webhookSenderService;

	@Autowired
	private ClickCache clickCache;

//	@Scheduled(fixedRate = 900000) // every 10 seconds
	public void checkClicks() {

		checkLink("bit.ly/4bekBvl", "Disha Google Form");
		checkLink("bit.ly/47sG01v", "Vandana Google Form");
		checkLink("bit.ly/4b7eqcE", "Dasthagiri Google Form");
		checkLink("bit.ly/40mjovR", "Ramakrishna Google Form");
		checkLink("bit.ly/4s8F2jt", "Swapna Google Form");
		checkLink("bit.ly/4s3hgVM", "Puspa Google Form");

	}

	private void checkLink(String link, String name) {

	    int current = bitlyService.getClicks(link);
	    int previous = clickCache.getPrevious(link);

	    Map<String, Integer> referrers = bitlyService.getReferrers(link);
	    Map<String, Integer> countries = bitlyService.getCountries(link);

	    // 🔹 Top referrer
	    String topRef = "Unknown";
	    int maxRef = 0;

	    for (Map.Entry<String, Integer> entry : referrers.entrySet()) {
	        if (entry.getValue() > maxRef) {
	            maxRef = entry.getValue();
	            topRef = entry.getKey();
	        }
	    }

	    // 🔹 All countries (formatted)
	    StringBuilder countryDetails = new StringBuilder();

	    for (Map.Entry<String, Integer> entry : countries.entrySet()) {
	        countryDetails.append(entry.getKey())
	                .append(":")
	                .append(entry.getValue())
	                .append(", ");
	    }

	    // 🔥 Trigger alert only when new clicks come
	    if (current > previous) {

	        int newClicks = current - previous;

	        String message = "🚀 Hachion Alert\n"
	                + "Link: " + name + "\n"
	                + "New Clicks: " + newClicks + "\n"
	                + "Total: " + current + "\n"
	                + "Referrence: " + topRef + "\n"
	                + "Countries: " + countryDetails.toString();

//	        webhookSenderService.sendMessage(message);

	        clickCache.update(link, current);
	    }
	}
}