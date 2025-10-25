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

	@Value("${twilio.reminderMessageBefore2Days:}")
	private String reminderMessageBefore2Days;

	@Value("${twilio.paymentDueToday:}")
	private String paymentDueToday;

	@Value("${twilio.paymentOverdue2Days:}")
	private String paymentOverdue2Days;

	@Value("${twilio.paymentOverdue7Days:}")
	private String paymentOverdue7Days;

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

//	public void sendTwoDayHeadsUpReminder(String mobile, String studentName, Double amountDue, String courseName,
//			LocalDate dueDate) {
//		try {
//			Twilio.init(accountSid, authToken);
//
//			String toWhatsApp = "whatsapp:" + (mobile == null ? "" : mobile.trim().replaceAll("\\s+", ""));
//			if (toWhatsApp.length() <= "whatsapp:".length())
//				return; // no number
//
//			// Your template expects: {{1}} name, {{2}} amount, {{3}} course, {{4}} due date
//			String variablesJson = new com.fasterxml.jackson.databind.ObjectMapper()
//					.writeValueAsString(java.util.Map.of("1", safe(studentName, "Student"), "2", fmtAmount(amountDue), // e.g.
//																														// "2500.00"
//							"3", safe(courseName, "Course"), "4", safe(fmtDate(dueDate, "dd-MMM-yyyy"), "TBD") // e.g.
//																												// "27-Sep-2025"
//					));
//
//			com.twilio.rest.api.v2010.account.Message.creator(new com.twilio.type.PhoneNumber(toWhatsApp),
//					new com.twilio.type.PhoneNumber(fromWhatsApp), "" // body must be empty when using Content SID
//			).setContentSid((reminderMessageBefore2Days != null && !reminderMessageBefore2Days.isBlank())
//					? reminderMessageBefore2Days
//					: reminderMessageBefore2Days // optional fallback if you want
//			).setContentVariables(variablesJson).create();
//
//		} catch (Exception e) {
//			System.err.println("❌ WhatsApp D-2 reminder failed: " + e.getMessage());
//			e.printStackTrace();
//		}
//	}

	public void sendTwoDayHeadsUpReminder(String mobile, String studentName, Double amountDue, String courseName,
			LocalDate dueDate) {
		try {
			Twilio.init(accountSid, authToken);

			String toWhatsApp = "whatsapp:" + (mobile == null ? "" : mobile.trim().replaceAll("\\s+", ""));
			if (toWhatsApp.length() <= "whatsapp:".length())
				return; // no number

			if (reminderMessageBefore2Days == null || reminderMessageBefore2Days.isBlank()) {
				System.err
						.println("❌ WhatsApp D-2 template SID is not configured (twilio.reminderMessageBefore2Days).");
				return;
			}

			String variablesJson = new com.fasterxml.jackson.databind.ObjectMapper()
					.writeValueAsString(java.util.Map.of("1", safe(studentName, "Student"), "2", fmtAmount(amountDue),
							"3", safe(courseName, "Course"), "4", safe(fmtDate(dueDate, "dd-MMM-yyyy"), "TBD")));

			com.twilio.rest.api.v2010.account.Message.creator(new com.twilio.type.PhoneNumber(toWhatsApp),
					new com.twilio.type.PhoneNumber(fromWhatsApp), "" // body must be empty when using Content SID
			).setContentSid(reminderMessageBefore2Days) // <-- only this SID
					.setContentVariables(variablesJson).create();

		} catch (Exception e) {
			System.err.println("❌ WhatsApp D-2 reminder failed: " + e.getMessage());
			e.printStackTrace();
		}
	}

	private String fmtAmount(Double v) {
		if (v == null)
			return "0.00";
		return String.format("%.2f", v);
	}

	private String fmtDate(LocalDate d, String pattern) {
		try {
			return (d == null) ? null : d.format(java.time.format.DateTimeFormatter.ofPattern(pattern));
		} catch (Exception e) {
			return null;
		}
	}

	private String computeStatusText(LocalDate dueDate, LocalDate today, long daysOverdue) {
		if (dueDate == null || today == null)
			return "Payment status update";
		if (dueDate.isEqual(today))
			return "Payment due today";
		if (dueDate.isAfter(today)) {
			long d = java.time.temporal.ChronoUnit.DAYS.between(today, dueDate);
			return (d == 2) ? "Heads-up: due in 2 days" : "Upcoming payment";
		}
		return (daysOverdue >= 7) ? ("Overdue by " + daysOverdue + " days (final reminder)")
				: ("Overdue by " + daysOverdue + " days");
	}

	public void sendPaymentDueTodayReminder(String mobile, String studentName, Double amountDue, String courseName,
			LocalDate dueDate) {
		try {
			Twilio.init(accountSid, authToken);

			String toWhatsApp = "whatsapp:" + (mobile == null ? "" : mobile.trim().replaceAll("\\s+", ""));
			if (toWhatsApp.length() <= "whatsapp:".length())
				return; // no number

			if (paymentDueToday == null || paymentDueToday.isBlank()) {
				System.err.println("❌ Missing SID: set twilio.paymentDueToday in application.properties");
				return;
			}

			// Template variables: {{1}} name, {{2}} amount, {{3}} course, {{4}} date
			String variablesJson = new com.fasterxml.jackson.databind.ObjectMapper()
					.writeValueAsString(java.util.Map.of("1", safe(studentName, "Student"), "2", fmtAmount(amountDue), // e.g.,
																														// 2500.00
																														// (add
																														// currency
																														// symbol
																														// in
																														// template
																														// if
																														// you
																														// want)
							"3", safe(courseName, "Course"), "4", safe(fmtDate(dueDate, "dd-MMM-yyyy"), "TBD") // e.g.,
																												// 25-Sep-2025
					));

			com.twilio.rest.api.v2010.account.Message.creator(new com.twilio.type.PhoneNumber(toWhatsApp),
					new com.twilio.type.PhoneNumber(fromWhatsApp), "" // body empty when using Content SID
			).setContentSid(paymentDueToday).setContentVariables(variablesJson).create();

		} catch (Exception e) {
			System.err.println("❌ WhatsApp D-0 reminder failed: " + e.getMessage());
			e.printStackTrace();
		}
	}

	public void sendPaymentOverdue2DaysReminder(String mobile, String studentName, Double amountDue, // Balance Amount
			String courseName, LocalDate dueDate) {
		try {
			Twilio.init(accountSid, authToken);

			String toWhatsApp = "whatsapp:" + (mobile == null ? "" : mobile.trim().replaceAll("\\s+", ""));
			if (toWhatsApp.length() <= "whatsapp:".length())
				return; // no number

			if (paymentOverdue2Days == null || paymentOverdue2Days.isBlank()) {
				System.err.println("❌ Missing SID: set twilio.paymentOverdue2Days in application.properties");
				return;
			}

			// Template vars: {{1}} name, {{2}} amount, {{3}} course, {{4}} due date
			String variablesJson = new com.fasterxml.jackson.databind.ObjectMapper()
					.writeValueAsString(java.util.Map.of("1", safe(studentName, "Student"), "2", fmtAmount(amountDue), // e.g.,
																														// 2500.00
							"3", safe(courseName, "Course"), "4", safe(fmtDate(dueDate, "dd-MMM-yyyy"), "TBD") // e.g.,
																												// 23-Sep-2025
					));

			com.twilio.rest.api.v2010.account.Message.creator(new com.twilio.type.PhoneNumber(toWhatsApp),
					new com.twilio.type.PhoneNumber(fromWhatsApp), "" // body empty when using Content SID
			).setContentSid(paymentOverdue2Days).setContentVariables(variablesJson).create();

		} catch (Exception e) {
			System.err.println("❌ WhatsApp Overdue(2d) send failed: " + e.getMessage());
			e.printStackTrace();
		}
	}
	public void sendPaymentOverdue7DaysReminder(
	        String mobile,
	        String studentName,
	        Double amountDue,    // Balance Amount
	        String courseName,
	        LocalDate dueDate
	) {
	    try {
	        Twilio.init(accountSid, authToken);

	        String toWhatsApp = "whatsapp:" + (mobile == null ? "" : mobile.trim().replaceAll("\\s+", ""));
	        if (toWhatsApp.length() <= "whatsapp:".length()) return; // no number

	        if (paymentOverdue7Days == null || paymentOverdue7Days.isBlank()) {
	            System.err.println("❌ Missing SID: set twilio.paymentOverdue7Days in application.properties");
	            return;
	        }

	        // Template vars: {{1}} name, {{2}} amount, {{3}} course, {{4}} due date
	        String variablesJson = new com.fasterxml.jackson.databind.ObjectMapper()
	            .writeValueAsString(java.util.Map.of(
	                "1", safe(studentName, "Student"),
	                "2", fmtAmount(amountDue),
	                "3", safe(courseName, "Course"),
	                "4", safe(fmtDate(dueDate, "dd-MMM-yyyy"), "TBD")
	            ));

	        com.twilio.rest.api.v2010.account.Message.creator(
	            new com.twilio.type.PhoneNumber(toWhatsApp),
	            new com.twilio.type.PhoneNumber(fromWhatsApp),
	            "" // body empty when using Content SID
	        )
	        .setContentSid(paymentOverdue7Days)
	        .setContentVariables(variablesJson)
	        .create();

	    } catch (Exception e) {
	        System.err.println("❌ WhatsApp Overdue(7d) send failed: " + e.getMessage());
	        e.printStackTrace();
	    }
	}

}
