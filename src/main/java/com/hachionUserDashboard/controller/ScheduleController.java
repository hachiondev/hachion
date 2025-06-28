package com.hachionUserDashboard.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.format.TextStyle;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import com.hachionUserDashboard.dto.BatchScheduleResponse;
import com.hachionUserDashboard.entity.CourseSchedule;
import com.hachionUserDashboard.repository.CourseRepository;
import com.hachionUserDashboard.repository.CourseScheduleRepository;

import Service.Schedule;

@CrossOrigin
@RestController
public class ScheduleController {

	private Schedule scheduleservice = null;

	@Autowired
	private CourseScheduleRepository repo;

	@Autowired
	private CourseRepository courseRepository;

	public ScheduleController(Schedule userService) {
		this.setScheduleservice(userService);
	}

	@GetMapping("/schedulecourse/{id}")
	public CourseSchedule getCourseSchedule(@PathVariable Integer id) {
		CourseSchedule courseschedule = repo.findById(id).get();
		return courseschedule;
	}

	@GetMapping("/schedulecourse")
	public List<CourseSchedule> getAllCourseSchedule(@RequestParam(defaultValue = "UTC") String timezone,
			@RequestParam(defaultValue = "user") String userType) {
		List<CourseSchedule> coursescheduleList = repo.findAllActiveSchedules();

		if ("admin".equalsIgnoreCase(userType)) {
			return coursescheduleList;
		}

		Map<CourseSchedule, ZonedDateTime> scheduleToDateTimeMap = new HashMap<>();

		for (CourseSchedule schedule : coursescheduleList) {
			try {
				String inputDateTimeStr = schedule.getSchedule_date() + " " + schedule.getSchedule_time();
				DateTimeFormatter inputFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm a", Locale.ENGLISH);

				LocalDateTime istDateTime = LocalDateTime.parse(inputDateTimeStr, inputFormatter);
				ZonedDateTime istZoned = istDateTime.atZone(ZoneId.of("Asia/Kolkata"));
				ZonedDateTime userZoned = istZoned.withZoneSameInstant(ZoneId.of(timezone));

				scheduleToDateTimeMap.put(schedule, userZoned);

				String convertedDate = userZoned.toLocalDate().toString();
				String convertedTime = userZoned.toLocalTime()
						.format(DateTimeFormatter.ofPattern("hh:mm a", Locale.ENGLISH));
				String timeZoneAbbreviation = userZoned.format(DateTimeFormatter.ofPattern("zzz", Locale.ENGLISH));
				String finalTime = convertedTime + " " + timeZoneAbbreviation;

				schedule.setSchedule_date(convertedDate);
				schedule.setSchedule_time(finalTime);

				String weekDay = userZoned.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.ENGLISH);
				schedule.setSchedule_week(weekDay);

			} catch (DateTimeParseException e) {
			
			    System.out.println("❌ Failed to parse schedule datetime:");
			    System.out.println("   ➤ Schedule ID      : " + schedule.getCourse_schedule_id());
			    System.out.println("   ➤ course name : " + schedule.getSchedule_course_name());
			    System.out.println("   ➤ category name : " + schedule.getSchedule_category_name());
			    System.out.println("   ➤ Schedule Date    : " + schedule.getSchedule_date());
			    System.out.println("   ➤ Schedule Time    : " + schedule.getSchedule_time());
			    System.out.println("   ➤ Error Message    : " + e.getMessage());
			}
			
		}

		coursescheduleList.sort(Comparator.comparing(scheduleToDateTimeMap::get));

		return coursescheduleList;
	}

	@PostMapping("/schedulecourse/add")
	@ResponseStatus(code = HttpStatus.CREATED)
	public void createCourse(@RequestBody CourseSchedule courseschedule) {
		String prefix = "";
		if ("Live Demo".equalsIgnoreCase(courseschedule.getSchedule_mode())) {
			prefix = "LDM-";
		} else if ("Live Class".equalsIgnoreCase(courseschedule.getSchedule_mode())) {
			prefix = "LCL-";
		}

		String shortCourse = "";
		if (courseschedule.getSchedule_course_name() != null) {
			String dbShortCourse = courseRepository
					.findShortCourseByCourseName(courseschedule.getSchedule_course_name());
			if (dbShortCourse != null) {
				shortCourse = dbShortCourse.replaceAll("\\s", "").toUpperCase();
			}
		}

		String dateFormatted = "";
		if (courseschedule.getSchedule_date() != null) {
			try {
				LocalDate date = LocalDate.parse(courseschedule.getSchedule_date());
				dateFormatted = date.format(DateTimeFormatter.ofPattern("MMMddyyyy", Locale.ENGLISH)).toUpperCase();
			} catch (DateTimeParseException e) {

			}
		}

		String timePart = "";
		if (courseschedule.getSchedule_time() != null) {
			timePart = courseschedule.getSchedule_time().replace(":", "").replaceAll("\\s+", "").toUpperCase();
		}

		String batchId = prefix + shortCourse + dateFormatted + "-" + timePart;
		courseschedule.setBatchId(batchId);

		repo.save(courseschedule);
	}

	@PutMapping("/schedulecourse/update/{id}")
	public ResponseEntity<CourseSchedule> updateCourseSchedule(@PathVariable int id,
			@RequestBody CourseSchedule updatedCourseSchedule) {
		Optional<CourseSchedule> optionalCourseSchedule = repo.findById(id);

		if (optionalCourseSchedule.isPresent()) {
			CourseSchedule courseschedule = optionalCourseSchedule.get();

			courseschedule.setSchedule_course_name(updatedCourseSchedule.getSchedule_course_name());
			courseschedule.setSchedule_category_name(updatedCourseSchedule.getSchedule_category_name());
			courseschedule.setSchedule_duration(updatedCourseSchedule.getSchedule_duration());
			courseschedule.setSchedule_mode(updatedCourseSchedule.getSchedule_mode());
			courseschedule.setSchedule_time(updatedCourseSchedule.getSchedule_time());
			courseschedule.setSchedule_week(updatedCourseSchedule.getSchedule_week());
			courseschedule.setSchedule_date(updatedCourseSchedule.getSchedule_date());
			courseschedule.setMeeting_link(updatedCourseSchedule.getMeeting_link());
			courseschedule.setTrainer_name(updatedCourseSchedule.getTrainer_name());

			repo.save(courseschedule);

			return ResponseEntity.ok(courseschedule);
		} else {

			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
		}
	}

	@DeleteMapping("schedulecourse/delete/{id}")
	public ResponseEntity<?> deleteCourseSchedule(@PathVariable int id) {
		CourseSchedule courseschedule = repo.findById(id).get();
		repo.delete(courseschedule);
		return null;

	}

	public Schedule getScheduleservice() {
		return scheduleservice;
	}

	public void setScheduleservice(Schedule scheduleservice) {
		this.scheduleservice = scheduleservice;
	}

	@GetMapping("/schedulecourse/all")
	public ResponseEntity<?> getAllCourseNames() {
		List<String> courseNames = repo.findAllCourseNames();

		if (courseNames.isEmpty()) {
			return new ResponseEntity<>("No courses available", HttpStatus.NO_CONTENT);
		}

		return new ResponseEntity<>(courseNames, HttpStatus.OK);
	}

//	@GetMapping("/batchInfo")
//	public ResponseEntity<?> getBatchScheduleInfo(@RequestParam String batchId) {
//		List<Object[]> results = repo.findCountAndScheduleDateListByBatchId(batchId);
//
//		if (results.isEmpty()) {
//			return ResponseEntity.badRequest().body("Invalid batchId. Please provide a valid one.");
//		}
//
//		Object[] row = results.get(0);
//		Long count = ((Number) row[0]).longValue();
//		LocalDate startDate = LocalDate.parse((String) row[1]);
//
//		LocalDate completionDate;
//		String numberOfClassesStr = "0";
//
//		if (batchId.startsWith("LDM")) {
//			completionDate = startDate;
//
//		} else if (batchId.startsWith("LCL")) {
//			String exactBatchId = repo.findExactBatchId(batchId);
//			if (exactBatchId != null && exactBatchId.equals(batchId)) {
//				numberOfClassesStr = repo.findNumberOfClassesByBatchId(batchId);
//				int numberOfClasses;
//				try {
//					numberOfClasses = Integer.parseInt(numberOfClassesStr);
//				} catch (NumberFormatException e) {
//					numberOfClasses = 0;
//				}
//				completionDate = startDate.plusDays(numberOfClasses);
//			} else {
//				completionDate = startDate;
//			}
//
//		} else {
//			completionDate = startDate;
//		}
//
//		BatchScheduleResponse response = new BatchScheduleResponse(batchId, count, startDate, completionDate,
//				numberOfClassesStr);
//		return ResponseEntity.ok(response);
//	}

}