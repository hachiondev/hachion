package com.hachionUserDashboard.service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Stream;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.entity.CourseSchedule;
import com.hachionUserDashboard.repository.CourseRepository;
import com.hachionUserDashboard.repository.CourseScheduleRepository;
import com.hachionUserDashboard.util.FaqLoader;

@Service
public class ChatService {

	@Autowired
	private CourseScheduleRepository scheduleRepository;

	@Autowired
	private CourseRepository courseRepository;
	
	@Autowired
	private WebhookSenderService webhookSenderService;

	private static final Map<String, String> faqMap = FaqLoader.loadFaq("faq.txt");

	private static final List<String> scheduleKeywords = List.of("schedule", "date", "time", "timing", "start",
			"batch");

	private static final List<String> demoKeywords = List.of("demo", "live", "session", "webinar", "free", "trial",
			"upcoming", "preview");

	private static final List<String> demoIntentPhrases = List.of("live demo", "live", "demo", "demo class",
			"demo session", "upcoming demo", "free class", "trial class", "demo schedule", "demo timings",
			"live training", "webinar schedule", "upcoming", "attend demo");

	public String getChatResponse(String userMessage) {
		if (userMessage == null || userMessage.trim().isEmpty()) {
			return "Please enter a valid message.";
		}

		String cleaned = userMessage.trim().toLowerCase();

		List<String> greetings = List.of("hi", "hello", "hey", "hai", "good morning", "good evening", "good afternoon");
		List<String> userMatchingWords = Arrays.asList(cleaned.split("\\s+"));

		if (userMatchingWords.stream().anyMatch(greetings::contains)) {
			return "👋 Hi! I’m Hachion Bot. How can I help you today?";
		}

		boolean isDemoQuery = Stream.concat(demoKeywords.stream(), demoIntentPhrases.stream())
				.anyMatch(cleaned::contains) && !cleaned.contains("live class");

		boolean isLiveClassQuery = cleaned.contains("live class") || cleaned.contains("live classes");

		if (isDemoQuery) {
			List<CourseSchedule> demoSchedules = scheduleRepository.findAllByScheduleMode("live demo");
			if (demoSchedules.isEmpty()) {
				return "⚠️ No upcoming live demo sessions are currently scheduled.";
			}
			StringBuilder sb = new StringBuilder("🎓 *Upcoming Live Demo Sessions:*\n");
			for (CourseSchedule cs : demoSchedules) {
				sb.append("🔹 *").append(capitalize(cs.getSchedule_course_name())).append("* – ")
						.append(cs.getSchedule_date()).append(" (").append(cs.getSchedule_week()).append("), ")
						.append(cs.getSchedule_time()).append("\n");
			}
			return sb.toString().trim();
		}

		if (isLiveClassQuery) {
			List<CourseSchedule> classSchedules = scheduleRepository.findAllByScheduleMode("live class");
			if (classSchedules.isEmpty()) {
				return "⚠️ No live classes are currently available.";
			}
			StringBuilder sb = new StringBuilder("📚 *Currently Running Live Classes:*\n");
			for (CourseSchedule cs : classSchedules) {
				sb.append("🔹 *").append(capitalize(cs.getSchedule_course_name())).append("* – ")
						.append(cs.getSchedule_date()).append(" (").append(cs.getSchedule_week()).append("), ")
						.append(cs.getSchedule_time()).append("\n");
			}
			return sb.toString().trim();
		}

		boolean isScheduleQuery = scheduleKeywords.stream().anyMatch(cleaned::contains);
		if (cleaned.contains("any class") || cleaned.contains("any classes") || cleaned.contains("scheduled now")
				|| cleaned.contains("currently running") || cleaned.contains("ongoing classes")
				|| cleaned.contains("happening now") || cleaned.contains("any sessions")) {

			List<CourseSchedule> demoSchedules = scheduleRepository.findAllByScheduleMode("live demo");
			List<CourseSchedule> classSchedules = scheduleRepository.findAllByScheduleMode("live class");

			if (demoSchedules.isEmpty() && classSchedules.isEmpty()) {
				return "⚠️ Currently, there are no live sessions or demo classes scheduled.";
			}

			StringBuilder sb = new StringBuilder("🟢 *Currently Scheduled Sessions:*\n");

			if (!classSchedules.isEmpty()) {
				sb.append("\n📚 *Live Classes:*\n");
				for (CourseSchedule cs : classSchedules) {
					sb.append("🔹 *").append(capitalize(cs.getSchedule_course_name())).append("* – ")
							.append(cs.getSchedule_date()).append(" (").append(cs.getSchedule_week()).append("), ")
							.append(cs.getSchedule_time()).append("\n");
				}
			}

			if (!demoSchedules.isEmpty()) {
				sb.append("\n🎓 *Live Demo Sessions:*\n");
				for (CourseSchedule cs : demoSchedules) {
					sb.append("🔹 *").append(capitalize(cs.getSchedule_course_name())).append("* – ")
							.append(cs.getSchedule_date()).append(" (").append(cs.getSchedule_week()).append("), ")
							.append(cs.getSchedule_time()).append("\n");
				}
			}
			return sb.toString().trim();
		}

		List<String> knownCourses = courseRepository.findAllCourseNames();
		Set<String> inputWords = new HashSet<>(Arrays.asList(cleaned.split("\\s+")));

		for (String course : knownCourses) {
			String normalizedCourse = course.trim().toLowerCase();
			List<String> courseWords = Arrays.asList(normalizedCourse.split("\\s+"));

			boolean allWordsPresent = courseWords.stream().allMatch(inputWords::contains);
			if (allWordsPresent) {
				System.out.println("👉 Course-related query detected for: " + course);
				String courseSlug = normalizedCourse.replaceAll("\\s+", "-");
				String courseLink = "http://localhost:3000/coursedetails/" + courseSlug;
				return "🔗 This is the course navigation link. Please click below to view more: \n👉 " + courseLink;
			}
		}
		if (userMatchingWords.stream()
				.anyMatch(word -> word.equals("details") || word.equals("information") || word.equals("course"))) {
			String sorryResponse = "❌ Sorry, the course you're looking for is not available right now. \n✍️ We’ve noted your interest and will update you once it's available.";
			webhookSenderService.sendToWorkspace(userMessage, sorryResponse);
			return sorryResponse;
		}

		if (cleaned.contains("how many courses") || cleaned.contains("available courses")
				|| cleaned.contains("list of courses") || cleaned.contains("what courses")
				|| cleaned.contains("courses you offer") || cleaned.contains("courses available")) {

			if (knownCourses.isEmpty()) {
				return "⚠️ Currently, there are no courses available in our catalog.";
			}

			StringBuilder sb = new StringBuilder("🎓 *Available Courses at Hachion:*\n");
			for (String course : knownCourses) {
				sb.append("🔹 ").append(capitalize(course)).append("\n");
			}
			return sb.toString().trim();
		}

		String bestMatch = null;
		int maxMatchCount = 0;
		String[] userWords = cleaned.replaceAll("[^a-z0-9 ]", "").split("\\s+");

		for (Map.Entry<String, String> entry : faqMap.entrySet()) {
			String question = entry.getKey().toLowerCase();
			String[] questionWords = question.replaceAll("[^a-z0-9 ]", "").split("\\s+");

			int matchCount = 0;
			for (String word : userWords) {
				for (String qWord : questionWords) {
					if (word.equals(qWord)) {
						matchCount++;
						break;
					}
				}
			}
			if (matchCount > maxMatchCount) {
				maxMatchCount = matchCount;
				bestMatch = question;
			}
		}

		if (maxMatchCount >= 2 && bestMatch != null) {
			System.out.println("✅ Response source: FAQ FILE (faq.txt)");
			return faqMap.get(bestMatch);
		}

		System.out.println("❌ No match found. Showing fallback support message.");
		return "🤖 I'm here to help, but I couldn't find an exact answer to your question.\n"
				+ "📩 For further assistance, feel free to contact our support team at *trainings@hachion.co*.\n"
				+ "💡 You can also try asking about course schedules, live demos, or available courses.";
	}

	private String capitalize(String word) {
		if (word == null || word.isEmpty())
			return word;
		return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
	}
}
