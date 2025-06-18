package com.hachionUserDashboard.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hachionUserDashboard.entity.RegisterStudent;

import java.time.format.DateTimeFormatter;

@Service
public class WebhookSenderService {

    private final RestTemplate restTemplate = new RestTemplate();

    
    private static final String WEBHOOK_URL = "https://your-workspace-webhook-url";

    public void sendRegistrationDetails(RegisterStudent student) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd-MM-yyyy");

        String message = String.format(
                "📢 *New Student Registered!*\n\n*First Name:* %s\n*Last Name:* %s\n*User Name:* %s\n*Mobile:* %s\n*Country:* %s\n*Date:* %s",
                student.getFirstName(),
                student.getLastName(),
                student.getUserName(),
                student.getMobile(),
                student.getCountry(),
                student.getDate().format(formatter)
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String payload = "{\"text\": \"" + message.replace("\"", "\\\"") + "\"}";

        HttpEntity<String> entity = new HttpEntity<>(payload, headers);

        try {
            restTemplate.postForEntity(WEBHOOK_URL, entity, String.class);
            System.out.println("✅ Webhook sent successfully.");
        } catch (Exception e) {
            System.err.println("❌ Failed to send webhook: " + e.getMessage());
        }
    }
}