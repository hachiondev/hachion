package com.hachionUserDashboard.service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.hachionUserDashboard.entity.Enroll;
import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import com.twilio.type.PhoneNumber;

@Service
public class WhatsAppService {

	@Value("${twilio.accountSid}")
	private String accountSid;

	@Value("${twilio.authToken}")
	private String authToken;

	@Value("${twilio.fromWhatsApp}")
	private String fromWhatsApp;

	@Value("${twilio.contentSid}")
	private String contentSid;

	@Value("${twilio.demoContentSid}")
	private String demoContentSid;

	@Value("${twilio.fromSms}")
	private String fromSms;

	public void sendLiveClassDemoEnrollmentDetails(Enroll enroll) {
		try {

			Twilio.init(accountSid, authToken);

			String toWhatsApp = "whatsapp:" + enroll.getMobile().trim().replaceAll("\\s+", "");

			String formattedDate = enroll.getEnroll_date();
			try {
				LocalDate date = LocalDate.parse(enroll.getEnroll_date());
				formattedDate = date.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

			} catch (Exception ex) {

			}

			String candidateName = safe(enroll.getName(), "Student");
			String mode = safe(enroll.getMode(), "No");
			String demoDate = safe(formattedDate, "TBD");
			String time = safe(enroll.getTime(), "TBD");
			String meetingLink = safe(enroll.getMeeting_link(), "https://www.hachion.co");
			String trainerName = safe(enroll.getTrainer(), "Trainer");
			String topicsCovered = "Introduction to " + enroll.getCourse_name() + " & Career Path";

			String variablesJson = new ObjectMapper().writeValueAsString(Map.of(

					"1", candidateName, "2", mode, "3", demoDate, "4", time, "5", meetingLink, "6", trainerName, "7",
					topicsCovered));

			Message message = Message.creator(new PhoneNumber(toWhatsApp), new PhoneNumber(fromWhatsApp), "")
					.setContentSid(contentSid).setContentVariables(variablesJson).create();

		} catch (Exception e) {
			System.err.println("❌ Error sending WhatsApp message:");
			e.printStackTrace();
		}
	}

	private String safe(String value, String fallback) {
		return (value != null && !value.trim().isEmpty()) ? value.trim() : fallback;
	}

	public void sendLiveDemoEnrollmentDetails(Enroll enroll) {
		try {

			Twilio.init(accountSid, authToken);

			String toWhatsApp = "whatsapp:" + enroll.getMobile().trim().replaceAll("\\s+", "");

			String formattedDate = enroll.getEnroll_date();
			try {
				LocalDate date = LocalDate.parse(enroll.getEnroll_date());
				formattedDate = date.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));

			} catch (Exception ex) {

			}

			String candidateName = safe(enroll.getName(), "Student");
			String demoDate = safe(formattedDate, "TBD");
			String time = safe(enroll.getTime(), "TBD");
			String meetingLink = safe(enroll.getMeeting_link(), "https://www.hachion.co");
			String trainerName = safe(enroll.getTrainer(), "Trainer");
			String topicsCovered = "Introduction to " + enroll.getCourse_name() + " & Career Path";

			String variablesJson = new ObjectMapper().writeValueAsString(Map.of(

					"1", candidateName, "2", demoDate, "3", time, "4", meetingLink, "5", trainerName, "6",
					topicsCovered));

			Message message = Message.creator(new PhoneNumber(toWhatsApp), new PhoneNumber(fromWhatsApp), "")
					.setContentSid(demoContentSid).setContentVariables(variablesJson).create();

		} catch (Exception e) {
			System.err.println("❌ Error sending WhatsApp message:");
			e.printStackTrace();
		}
	}

	public void sendEnrollmentSms(Enroll enroll) {
		try {
			Twilio.init(accountSid, authToken);

			String toMobile = enroll.getMobile().trim().replaceAll("\\s+", "");
			if (!toMobile.startsWith("+")) {
				toMobile = "+91" + toMobile;
			}

			String candidateName = safe(enroll.getName(), "Student");
			String formattedDate = safe(enroll.getEnroll_date(), "TBD");
			try {
				LocalDate date = LocalDate.parse(enroll.getEnroll_date());
				formattedDate = date.format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
			} catch (Exception ignored) {
			}

			String time = safe(enroll.getTime(), "TBD");
			String meetingLink = safe(enroll.getMeeting_link(), "https://www.hachion.co");
			String trainerName = safe(enroll.getTrainer(), "Trainer");
			String topicsCovered = "Introduction to " + safe(enroll.getCourse_name(), "the course") + " & Career Path";

			String messageBody = String.format(
					"Hello %s,\n\nYou are registered for a live demo session.\n\n📅 Date: %s\n🕒 Time: %s\n👨‍🏫 Trainer: %s\n📚 Topics: %s\n🔗 Link: %s\n\nSee you there!",
					candidateName, formattedDate, time, trainerName, topicsCovered, meetingLink);

			Message message = Message.creator(new PhoneNumber(toMobile), new PhoneNumber(fromSms), messageBody)
					.create();

			System.out.println("✅ SMS sent. SID: " + message.getSid());

		} catch (Exception e) {
			System.err.println("❌ Error sending enrollment SMS:");
			e.printStackTrace();
		}
	}

}
