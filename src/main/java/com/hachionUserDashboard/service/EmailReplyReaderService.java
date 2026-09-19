package com.hachionUserDashboard.service;

import jakarta.mail.*;
import jakarta.mail.internet.InternetAddress;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.hachionUserDashboard.entity.RegisterStudent;
import com.hachionUserDashboard.repository.RegisterStudentRepository;

import java.util.Date;
import java.util.Optional;
import java.util.Properties;

@Service
public class EmailReplyReaderService {

	@Value("${spring.mail.username}")
	private String username;

	@Value("${spring.mail.password}")
	private String password;

	@Value("${google.chat.webhook}")
	private String webhookUrl;

	@Autowired
	private RegisterStudentRepository repository;

	public void readRepliesAndSendToChat() {

		try {

			Properties props = new Properties();
			props.put("mail.store.protocol", "imaps");

			Session session = Session.getInstance(props, null);
			Store store = session.getStore();

			store.connect("imap.gmail.com", username, password);

			Folder inbox = store.getFolder("INBOX");
			inbox.open(Folder.READ_WRITE);

			Message[] messages = inbox.getMessages();

//			long twoDaysAgo = System.currentTimeMillis() - (2L * 24 * 60 * 60 * 1000);
			// ✅ 27 HOURS WINDOW
			long windowTime = System.currentTimeMillis() - (27L * 60 * 60 * 1000);

			for (int i = messages.length - 1; i >= 0; i--) {

				Message message = messages[i];

				Date receivedDate = message.getReceivedDate();

				if (receivedDate == null) {
					continue;
				}

				if (receivedDate.getTime() < windowTime) {
					System.out.println("⏹️ Stopping - old emails");
					break;
				}

				String subject = message.getSubject();

//				if (subject == null || !subject.contains("[HACH")) {
//					continue;
//				}

				if (message.isSet(Flags.Flag.SEEN)) {
					System.out.println("⏭️ Already processed — skipping");
					continue;
				}

				String from = ((InternetAddress) message.getFrom()[0]).getAddress();
				String name = ((InternetAddress) message.getFrom()[0]).getPersonal();

				// 🔍 Find student by email (basic style)
				RegisterStudent student = repository.findByEmail(from);;

//				RegisterStudent studentOpt = 
//				if (studentOpt.isPresent()) {
//				    student = studentOpt.get();
//				} else {
//				    continue;
//				}
				if (student == null) {
				    System.out.println("❌ Not a registered student: " + from);
				    continue;
				}
				// 📩 Extract body
				String body = getTextFromMessage(message);

				// 📩 Send to Google Chat
				sendToGoogleChat(name, from, subject, body);

				// ✅ UPDATE RECEIVED COUNT
				Integer received = student.getEmailReceivedCount();

				if (received == null) {
				    student.setEmailReceivedCount(1);
				} else {
				    student.setEmailReceivedCount(received + 1);
				}

				// ✅ RESET LOGIC (WHEN COUNTS MATCH)
				Integer sent = student.getEmailSentCount();
				Integer rec = student.getEmailReceivedCount();

				if (sent != null && rec != null) {
				    if (sent.intValue() == rec.intValue()) {
				        student.setEmailSentCount(0);
				        student.setEmailReceivedCount(0);
				        System.out.println("🔄 Counts reset to 0 for: " + from);
				    }
				}

				// 💾 SAVE
				repository.save(student);

				// ✅ Mark as processed
				message.setFlag(Flags.Flag.SEEN, true);

				// 📊 Logs
				System.out.println("📊 Received Count: " + student.getEmailReceivedCount());
				System.out.println("📊 Sent Count: " + student.getEmailSentCount());
				System.out.println("✅ Marked as processed");
			}

			inbox.close(false);
			store.close();

			System.out.println("🏁 Finished");

		} catch (Exception e) {
			System.out.println("❌ ERROR:");
			e.printStackTrace();
		}
	}

	private void sendToGoogleChat(String name, String email, String subject, String body) {

		try {

			RestTemplate restTemplate = new RestTemplate();

			String message = "📩 *New Email Reply*\n\n" + "*Name:* " + (name != null ? name : "N/A") + "\n"
					+ "*Email:* " + email + "\n" + "*Subject:* " + subject + "\n" + "*Message:* " + body;

			String payload = "{ \"text\": \"" + message.replace("\"", "'").replace("\n", "\\n") + "\" }";

			restTemplate.postForEntity(webhookUrl, payload, String.class);

		} catch (Exception e) {

			e.printStackTrace();
		}
	}

	private String getTextFromMessage(Message message) throws Exception {

		if (message.isMimeType("text/plain")) {
			return message.getContent().toString();
		}

		if (message.isMimeType("multipart/*")) {
			Multipart multipart = (Multipart) message.getContent();

			for (int i = 0; i < multipart.getCount(); i++) {
				BodyPart bodyPart = multipart.getBodyPart(i);

				if (bodyPart.isMimeType("text/plain")) {
					return bodyPart.getContent().toString();
				}
			}
		}

		return "";
	}
}