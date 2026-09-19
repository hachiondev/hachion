package com.hachionUserDashboard.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class OpenAIService {

    @Value("${openai.api.key}")
    private String apiKey;

    @Value("${openai.url}")
    private String url;

    private final RestTemplate restTemplate = new RestTemplate();

    // ===============================
    // ✅ MAIN METHOD
    // ===============================
    public Map<String, String> generateEmail(String name, String course, String remark, String finalRemark) {

        String leadType = classifyLead(remark, finalRemark);
        String strategy = getStrategy(leadType);

        // 🔥 STRONG PROMPT (core improvement)
        String prompt = "You are a senior sales conversion expert for an EdTech company.\n\n"

                + "Lead Type: " + leadType + "\n"
                + "Strategy: " + strategy + "\n"
                + "Student Name: " + name + "\n"
                + "Course: " + course + "\n"
                + "Student Remark: " + remark + "\n"
                + "Final Remark: " + finalRemark + "\n\n"

                + "Write a HIGH-CONVERSION follow-up email.\n\n"

                + "Return ONLY valid JSON:\n"
                + "{ \"subject\": \"...\", \"body\": \"...\" }\n\n"

                + "Rules:\n"
                + "- Subject: short, personalized, relevant\n"
                + "- Body: max 100 words\n"
                + "- Start with: Hi " + name + ",\n"
                + "- Mention course naturally\n"
                + "- MUST address student concern directly\n"
                + "- Keep tone friendly and conversion-focused\n"
                + "- End with: Thank you, Team Hachion\n"
                + "- DO NOT generate generic email";

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("model", "gpt-4o-mini");

        List<Map<String, String>> messages = new ArrayList<>();

        // ✅ Improved system message
        Map<String, String> systemMessage = new HashMap<>();
        systemMessage.put("role", "system");
        systemMessage.put("content",
                "You generate highly targeted sales emails based on lead intent. "
                        + "Each email must directly address the student's concern and maximize conversion.");

        Map<String, String> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("content", prompt);

        messages.add(systemMessage);
        messages.add(userMessage);

        requestBody.put("messages", messages);

        // ✅ Stable output
        requestBody.put("temperature", 0.2);
        requestBody.put("max_tokens", 150);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(apiKey);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);

        List choices = (List) response.getBody().get("choices");
        Map choice = (Map) choices.get(0);
        Map message = (Map) choice.get("message");

        String result = message.get("content").toString();

        System.out.println("RAW OPENAI RESPONSE: " + result);

        try {
            // ✅ Clean JSON if wrapped injson
            result = result.replace("```json", "").replace("", "").trim();

            ObjectMapper mapper = new ObjectMapper();
            Map<String, String> emailData = mapper.readValue(result, Map.class);

            String subject = emailData.getOrDefault("subject", "Quick Follow-up on Your Training");
            String body = emailData.getOrDefault("body",
                    "Hi " + name + ",\n\nFollowing up regarding your interest in " + course + ".\n\nThank you,\nTeam Hachion");

            Map<String, String> finalResponse = new HashMap<>();
            finalResponse.put("subject", subject);
            finalResponse.put("body", body);

            return finalResponse;

        } catch (Exception e) {
            e.printStackTrace();

            // ✅ Fallback (important)
            Map<String, String> fallback = new HashMap<>();
            fallback.put("subject", "Quick Follow-up on " + course);
            fallback.put("body",
                    "Hi " + name + ",\n\nWe wanted to reconnect regarding your interest in " + course +
                            ". Please let us know a convenient time.\n\nThank you,\nTeam Hachion");

            return fallback;
        }
    }

    // ===============================
    // ✅ LEAD CLASSIFICATION
    // ===============================
    private String classifyLead(String remark, String finalRemark) {

        String text = ((remark == null ? "" : remark) + " " +
                       (finalRemark == null ? "" : finalRemark)).toLowerCase();

        if (text.contains("not interested") || text.contains("no need") || text.contains("joined")) {
            return "DEAD_LEAD";
        }

        if (text.contains("budget") || text.contains("$") || text.contains("price") || text.contains("cost")) {
            return "BUDGET_HIGH_INTENT";
        }

        if (text.contains("interested") || text.contains("join") || text.contains("enroll")) {
            return "HIGH_INTENT";
        }

        if (text.contains("busy") || text.contains("call later") || text.contains("after")) {
            return "WARM_LEAD";
        }

        if (text.contains("no response") || text.contains("not responding")) {
            return "COLD_LEAD";
        }

        return "GENERAL";
    }

    // ===============================
    // ✅ STRATEGY MAPPING
    // ===============================
    private String getStrategy(String leadType) {

        switch (leadType) {

            case "BUDGET_HIGH_INTENT":
                return "Acknowledge budget, offer discount, installment or basic plan, and push conversion.";

            case "HIGH_INTENT":
                return "Encourage immediate enrollment and create urgency.";

            case "WARM_LEAD":
                return "Reconnect politely and offer demo or scheduling.";

            case "COLD_LEAD":
                return "Soft follow-up without pressure.";

            default:
                return "General follow-up.";
        }
    }
}