//package com.hachionUserDashboard.service;
//
//
//import java.time.ZoneOffset;
//import java.time.ZonedDateTime;
//import java.time.format.DateTimeFormatter;
//
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//
//import com.hachionUserDashboard.repository.CourseScheduleRepository;
//
//import com.hachionUserDashboard.repository.UserRepository;
//
//@Service
//public class OtpCleanupScheduler {
//
//	@Autowired
//	private UserRepository userRepository;
//
//
////	@Scheduled(cron = "0 0 0 * * ?") // runs 1 day
////	@Scheduled(cron = "0 * * * * ?") //runs every 1 minute
//	@Scheduled(cron = "0 0 0 */7 * ?") //runs after 7 days 
//
//	@Autowired
//	private CourseScheduleRepository courseScheduleRepository;
//
////	@Scheduled(cron = "0 0 0 * * ?") // runs 1 day
////	@Scheduled(cron = "0 * * * * ?") //runs every 1 minute
//	@Scheduled(cron = "0 0 0 */7 * ?") // runs after 7 days
//>>>>>>> 217af75b915141185aab4e09fa3c2f091fd2f3f8
//	@Transactional
//	public void deleteUnverifiedUsers() {
//		int deletedRows = userRepository.deleteExpiredOtps();
//		System.out.println(deletedRows + " unverified users deleted.");
//	}
//<<<<<<< HEAD
//=======
//
////	@Scheduled(cron = "0 * * * * ?") // runs every 1 minute
////	@Scheduled(cron = "0 0 0 * * ?") // Runs daily at midnight
//	@Scheduled(cron = "0 0 0 */7 * ?") // runs after 7 days
//	@Transactional
//	public void deletePastWorkshops() {
//		// Write UTC timezone
//		ZonedDateTime nowInUtc = ZonedDateTime.now(ZoneOffset.UTC);
//		String todayDateInUtc = nowInUtc.format(DateTimeFormatter.ISO_LOCAL_DATE);
//
//		int deletedRows = courseScheduleRepository.deletePastWorkshops(todayDateInUtc);
//		System.out.println(deletedRows + " past workshop records deleted.");
//	}
//>>>>>>> 217af75b915141185aab4e09fa3c2f091fd2f3f8
//}
