package com.hachionUserDashboard.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.hachionUserDashboard.dto.TrainerRequest;
import com.hachionUserDashboard.entity.Trainer;
import com.hachionUserDashboard.repository.TrainerRepository;
import com.hachionUserDashboard.repository.UserReviewRepository;

import Service.TrainerService;

@Service
public class trainerserviceimp implements TrainerService {

	@Autowired

	private UserReviewRepository userReviewRepo;

	@Autowired
	private TrainerRepository trainerRepo;

	private static double truncate1(double val) {
		return Math.floor(val * 10.0) / 10.0;
	}

	// Blend for a specific trainer row (uses course if present)
//	public double computeBlended(Trainer t) {
//		if (t == null)
//			return 0.0;
//
//		final String trainerName = t.getTrainer_name();
//		final String courseName = t.getCourse_name(); // may be null/blank
//
//		// --- user reviews ---
//		UserReviewRepository.RatingSumCount urAgg = (courseName == null || courseName.isBlank())
//				? userReviewRepo.sumAndCountForTrainer(trainerName)
//				: userReviewRepo.sumAndCountForTrainerCourse(trainerName, courseName);
//
//		int urCnt = (urAgg != null && urAgg.getCnt() != null) ? urAgg.getCnt() : 0;
//		int urSum = (urAgg != null && urAgg.getSum() != null) ? urAgg.getSum() : 0;
//
//		// --- trainer table ---
//		TrainerRepository.TrainerSumCount trAgg = (courseName == null || courseName.isBlank())
//				? trainerRepo.trainerSumCountFor(trainerName)
//				: trainerRepo.trainerSumCountForCourse(trainerName, courseName);
//
//		int trCnt = (trAgg != null && trAgg.getCnt() != null) ? trAgg.getCnt() : 0;
//		double trSum = (trAgg != null && trAgg.getSum() != null) ? trAgg.getSum() : 0.0;
//
//		int totalCnt = urCnt + trCnt;
//		double totalSum = urSum + trSum;
//
//		if (totalCnt == 0)
//			return 0.0;
//		return truncate1(totalSum / totalCnt);
//	}
//
//	public TrainerRequest toDtoWithBlended(Trainer t) {
//		TrainerRequest dto = TrainerRequest.from(t);
//		dto.setTrainerUserRating(computeBlended(t));
//		return dto;
//	}

//	private static double truncate1(double v) {
//	    return Math.floor(v * 10.0) / 10.0;
//	}

	public double computeBlended(Trainer t) {
	    if (t == null) return 0.0;

	    final String trainerName = t.getTrainer_name();
	    final String courseName  = t.getCourse_name(); // or getCourse_name()

	    // --- user reviews ---
	    UserReviewRepository.RatingSumCount urAgg =
	        (courseName == null || courseName.isBlank())
	            ? userReviewRepo.sumAndCountForTrainer(trainerName)
	            : userReviewRepo.sumAndCountForTrainerCourse(trainerName, courseName);

	    long   urCnt = (urAgg != null && urAgg.getCnt() != null) ? urAgg.getCnt() : 0L;
	    double urSum = (urAgg != null && urAgg.getSum() != null) ? urAgg.getSum() : 0.0;

	    // --- trainer table ---
	    TrainerRepository.TrainerSumCount trAgg =
	        (courseName == null || courseName.isBlank())
	            ? trainerRepo.trainerSumCountFor(trainerName)
	            : trainerRepo.trainerSumCountForCourse(trainerName, courseName);

	    long   trCnt = (trAgg != null && trAgg.getCnt() != null) ? trAgg.getCnt() : 0L;
	    double trSum = (trAgg != null && trAgg.getSum() != null) ? trAgg.getSum() : 0.0;

	    long   totalCnt = urCnt + trCnt;
	    double totalSum = urSum + trSum;

	    if (totalCnt == 0L) return 0.0;

	    double avg = totalSum / (double) totalCnt; // force double division
	    return truncate1(avg); // 8/3 -> 2.6
	}

	public TrainerRequest toDtoWithBlended(Trainer t) {
	    TrainerRequest dto = TrainerRequest.from(t);
	    dto.setTrainerUserRating(computeBlended(t));
	    return dto;
	}

	public String getUserById(Long id) {

		return "User with ID: " + id;

	}
}