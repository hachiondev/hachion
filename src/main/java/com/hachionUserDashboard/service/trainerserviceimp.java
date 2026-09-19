package com.hachionUserDashboard.service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.dto.TrainerRequest;
import com.hachionUserDashboard.dto.TrainerSummaryDTO;
import com.hachionUserDashboard.entity.Trainer;
import com.hachionUserDashboard.repository.TrainerRepository;
import com.hachionUserDashboard.repository.UserReviewRepository;

import Service.TrainerService;

@Service
public class trainerserviceimp implements TrainerService {

	@Value("${trainer.upload-dir}")
	private String trainerImageUploadPath;

	// trainer.upload-dir is already correctly profile-scoped (test ->
	// .../uploads/test/trainer_images/, prod -> .../uploads/prod/trainer_images/).
	// Derive the "test"/"prod" segment from it instead of hardcoding one, so the
	// path stored in the DB/returned to the frontend always matches the actual
	// environment the image was uploaded to.
	private String trainerImagePublicPrefix() {
		String normalized = trainerImageUploadPath.replaceAll("/+$", "");
		Path p = Paths.get(normalized);
		String envSegment = p.getParent() != null ? p.getParent().getFileName().toString() : "prod";
		return "uploads/" + envSegment + "/trainer_images/";
	}

	@Autowired
	private UserReviewRepository userReviewRepo;

	@Autowired
	private TrainerRepository trainerRepo;

	private static double truncate1(double val) {
		return Math.floor(val * 10.0) / 10.0;
	}

	public double computeBlended(Trainer t) {
		if (t == null)
			return 0.0;

		final String trainerName = t.getTrainer_name();
		final String courseName = t.getCourse_name(); // or getCourse_name()

		// --- user reviews ---
		UserReviewRepository.RatingSumCount urAgg = (courseName == null || courseName.isBlank())
				? userReviewRepo.sumAndCountForTrainer(trainerName)
				: userReviewRepo.sumAndCountForTrainerCourse(trainerName, courseName);

		long urCnt = (urAgg != null && urAgg.getCnt() != null) ? urAgg.getCnt() : 0L;
		double urSum = (urAgg != null && urAgg.getSum() != null) ? urAgg.getSum() : 0.0;

		// --- trainer table ---
		TrainerRepository.TrainerSumCount trAgg = (courseName == null || courseName.isBlank())
				? trainerRepo.trainerSumCountFor(trainerName)
				: trainerRepo.trainerSumCountForCourse(trainerName, courseName);

		long trCnt = (trAgg != null && trAgg.getCnt() != null) ? trAgg.getCnt() : 0L;
		double trSum = (trAgg != null && trAgg.getSum() != null) ? trAgg.getSum() : 0.0;

		long totalCnt = urCnt + trCnt;
		double totalSum = urSum + trSum;

		if (totalCnt == 0L)
			return 0.0;

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

	@Override
	public Trainer addTrainer(Trainer trainer, MultipartFile trainerImage) throws IOException {
		if (trainerImage != null && !trainerImage.isEmpty()) {
			String imagePath = saveOrReplaceImage(null, trainerImage, trainer.getTrainer_name(),
					trainer.getCourse_name());
			trainer.setTrainerImage(imagePath);
		}
		Trainer saved = trainerRepo.save(trainer);
		return trainerRepo.findById(saved.getTrainer_id()).orElse(saved);
	}

	@Override
	public Trainer updateTrainer(int trainerId, Trainer updated, MultipartFile trainerImage) throws IOException {
		Trainer existing = trainerRepo.findById(trainerId)
				.orElseThrow(() -> new RuntimeException("Trainer not found: " + trainerId));

		existing.setTrainer_name(updated.getTrainer_name());
		existing.setCategory_name(updated.getCategory_name());
		existing.setCourse_name(updated.getCourse_name());
		existing.setSummary(updated.getSummary());
		existing.setDemo_link_1(updated.getDemo_link_1());
		existing.setDemo_link_2(updated.getDemo_link_2());
		existing.setDemo_link_3(updated.getDemo_link_3());
		existing.setDate(updated.getDate());
		existing.setTrainerRating(updated.getTrainerRating());
		existing.setExperience(updated.getExperience());
		existing.setDesignation(updated.getDesignation());
		existing.setExperienceCredentials(updated.getExperienceCredentials());

		if (trainerImage != null && !trainerImage.isEmpty()) {
			String imagePath = saveOrReplaceImage(existing.getTrainerImage(), trainerImage, existing.getTrainer_name(),
					existing.getCourse_name());
			existing.setTrainerImage(imagePath);
		}

		Trainer saved = trainerRepo.save(existing);
		return trainerRepo.findById(saved.getTrainer_id()).orElse(saved);
	}

	private String saveOrReplaceImage(String oldRelativePath, MultipartFile image, String trainerName,
			String courseName) throws IOException {

		// delete old one if exists
		deleteImageIfExists(oldRelativePath);

		File directory = new File(trainerImageUploadPath);
		if (!directory.exists()) {
			directory.mkdirs();
		}

		String relative = buildRelativeImagePath(trainerName, courseName, image.getOriginalFilename());

		// relative is:
		// "uploads/<env>/trainer_images/<sanitized-trainer>__<sanitized-course>__<file>"
		String prefix = trainerImagePublicPrefix();
		String fileNameOnly = relative.substring(prefix.length());

		Path abs = Paths.get(directory.getAbsolutePath(), fileNameOnly);
		Files.write(abs, image.getBytes(), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);

		return relative; // store this in DB
	}

	private String buildRelativeImagePath(String trainerName, String courseName, String originalFilename) {
		String sanitizedTrainer = sanitizeForFilename(trainerName);
		String sanitizedCourse = sanitizeForFilename(courseName);
		String sanitizedOriginal = sanitizeForFilename(originalFilename);

		return trainerImagePublicPrefix() + sanitizedTrainer + "__" + sanitizedCourse + "__" + sanitizedOriginal;
	}

	private void deleteImageIfExists(String storedRelativePath) {
		try {
			if (storedRelativePath == null || storedRelativePath.isEmpty())
				return;
			// Matches "uploads/<env>/trainer_images/<file>" regardless of which env
			// segment is stored, so pre-existing rows written by the old hardcoded
			// "uploads/prod/..." code still resolve correctly on test.
			if (!storedRelativePath.matches("^uploads/[^/]+/trainer_images/.+"))
				return;

			String fileNameOnly = storedRelativePath.substring(storedRelativePath.lastIndexOf('/') + 1);
			Path abs = Paths.get(trainerImageUploadPath, fileNameOnly);
			Files.deleteIfExists(abs);
		} catch (Exception e) {
			System.err.println("Failed to delete old trainer image: " + e.getMessage());
		}
	}

	private String sanitizeForFilename(String raw) {
		if (raw == null)
			return "unknown";
		String s = raw.trim().toLowerCase();
		s = s.replaceAll("[^a-z0-9._-]+", "-");
		s = s.replaceAll("-{2,}", "-");
		if (s.startsWith("-"))
			s = s.substring(1);
		if (s.isEmpty())
			s = "file";
		return s;
	}

	@Override
	public void deleteTrainer(int trainerId) {
		Trainer existing = trainerRepo.findById(trainerId)
				.orElseThrow(() -> new RuntimeException("Trainer not found: " + trainerId));

		String imagePath = existing.getTrainerImage();
		trainerRepo.deleteById(trainerId);
		deleteImageIfExists(imagePath);
	}

	@Override
	public List<Trainer> getTrainersByCourseName(String courseName) {
		return trainerRepo.findTrainersByCourseName(courseName);
	}

	@Override
	public List<Map<String, Object>> getTrainerSummaries() {

	    List<Object[]> rows = trainerRepo.getTrainerSummaries();

	    return rows.stream().map(row -> {
	        Map<String, Object> map = new HashMap<>();
	        map.put("trainerName", row[0]);
	        map.put("courseName", row[1]);
//	        map.put("trainerImage", row[2]);
//	        map.put("trainerRating", row[2]);
	        return map;
	    }).toList();
	}
}
