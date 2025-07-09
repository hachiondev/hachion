package com.hachionUserDashboard.service;

import java.util.List;
import java.util.Map;
import java.util.Optional;
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

	private static final Map<String, String> faqMap = FaqLoader.loadFaq("faq.txt");

	private static final List<String> scheduleKeywords = List.of("schedule", "date", "time", "timing", "start",
			"batch");

	private static final List<String> demoKeywords = List.of("demo", "live", "session", "webinar", "free", "trial","upcoming",
			"preview");

	private static final List<String> demoIntentPhrases = List.of("live demo", "live", "demo", "demo class", "demo session",
			"upcoming demo", "free class", "trial class", "demo schedule", "demo timings", "live training",
			"webinar schedule", "upcoming", "attend demo");

	public String getChatResponse(String userMessage) {
		if (userMessage == null || userMessage.trim().isEmpty()) {
			return "Please enter a valid message.";
		}

		String cleaned = userMessage.trim().toLowerCase();

		boolean isDemoQuery = Stream
				  .concat(demoKeywords.stream(), demoIntentPhrases.stream())
				  .anyMatch(cleaned::contains) && !cleaned.contains("live class");

				// Detect live class queries
				boolean isLiveClassQuery = cleaned.contains("live class") || cleaned.contains("live classes");

				// 🔹 Live Demo Response
				if (isDemoQuery) {
				    List<CourseSchedule> demoSchedules = scheduleRepository.findAllByScheduleMode("live demo");
				    if (demoSchedules.isEmpty()) {
				        return "⚠️ No upcoming live demo sessions are currently scheduled.";
				    }

				    StringBuilder sb = new StringBuilder("🎓 *Upcoming Live Demo Sessions:*\n");
				    for (CourseSchedule cs : demoSchedules) {
				        sb.append("🔹 *").append(capitalize(cs.getSchedule_course_name())).append("* – ")
				        .append(cs.getSchedule_date()).append(" (")
				        .append(cs.getSchedule_week()).append("), ")
				        .append(cs.getSchedule_time()).append("\n");
				    }
				    return sb.toString().trim();
				}

				// 🔵 Live Class Response
				if (isLiveClassQuery) {
				    List<CourseSchedule> classSchedules = scheduleRepository.findAllByScheduleMode("live class");
				    if (classSchedules.isEmpty()) {
				        return "⚠️ No live classes are currently available.";
				    }

				    StringBuilder sb = new StringBuilder("📚 *Currently Running Live Classes:*\n");
				    for (CourseSchedule cs : classSchedules) {
				        sb.append("🔹 *").append(capitalize(cs.getSchedule_course_name())).append("* – ")
				        .append(cs.getSchedule_date()).append(" (")
				        .append(cs.getSchedule_week()).append("), ")
				        .append(cs.getSchedule_time()).append("\n");
				    }
				    return sb.toString().trim();
				}
		boolean isScheduleQuery = scheduleKeywords.stream().anyMatch(cleaned::contains);

		if (isScheduleQuery) {
			// ✅ Load courses dynamically here
			List<String> knownCourses = courseRepository.findAllCourseNames();

			for (String course : knownCourses) {
				if (cleaned.contains(course.toLowerCase())) {
					System.out.println("👉 Schedule-related query detected for course: " + course);

					Optional<CourseSchedule> optionalSchedule = scheduleRepository
							.findTopActiveScheduleByCourseName(course);

					if (optionalSchedule.isPresent()) {
						System.out.println("✅ Response source: DATABASE (CourseSchedule)");
						CourseSchedule cs = optionalSchedule.get();
						return String.format(
								"📚 The %s course is scheduled on %s (%s) at %s.\nDuration: %s\nTrainer: %s\nMode: %s",
								capitalize(course), cs.getSchedule_date(), cs.getSchedule_week(), cs.getSchedule_time(),
								cs.getSchedule_duration(), cs.getTrainer_name(), cs.getSchedule_mode());
					} else {
						System.out.println("❌ No active schedule found in DB for course: " + course);
						return "⚠️ Currently, there is no active schedule available for " + capitalize(course) + ".";
					}
				}
			}
		}

		// Fallback to FAQ
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
		return "🤖 Please contact our Hachion support team at trainings@hachion.co.";
	}

	private String capitalize(String word) {
		if (word == null || word.isEmpty())
			return word;
		return word.substring(0, 1).toUpperCase() + word.substring(1).toLowerCase();
	}
}
