package com.hachionUserDashboard.service;

import java.io.File;
import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.InvalidPathException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hachionUserDashboard.entity.CorporateReview;
import com.hachionUserDashboard.repository.CorporateReviewRepository;

import Service.CorporateReviewService;

@Service
@Transactional
public class CorporateReviewServiceImpl implements CorporateReviewService {

	private final CorporateReviewRepository repo;
	private final ObjectMapper mapper;

	@Value("${image.upload.corporatereview.path}")
	private String uploadPath;

	public CorporateReviewServiceImpl(CorporateReviewRepository repo) {
		this.repo = repo;
		this.mapper = new ObjectMapper().registerModule(new JavaTimeModule());
	}

	@Override
	@Transactional(readOnly = true)
	public Optional<CorporateReview> getById(int id) {
		return repo.findByIdNative(id);
	}

	@Override
	@Transactional(readOnly = true)
	public List<CorporateReview> getAll() {
		return repo.findAllNative();
	}

	@Override
	@Transactional(readOnly = true)
	public List<CorporateReview> getByCourseName(String courseName) {
		return repo.findByCourseNameNative(courseName);
	}

	@Override
	public CorporateReview add(String reviewJson, MultipartFile companyLogo) {
		CorporateReview review = readJson(reviewJson);

		review.setDate(LocalDate.now());

		if (companyLogo != null && !companyLogo.isEmpty()) {
			String stored = storeLogo(companyLogo);
			review.setCompanyLogo(stored); // "logos/<filename.ext>"
		} else {
			review.setCompanyLogo(""); // or null—keep consistent with your style
		}

		return repo.save(review);
	}

	@Override
	public CorporateReview update(int id, String reviewJson, MultipartFile companyLogo) {
		CorporateReview incoming = readJson(reviewJson);

		CorporateReview existing = repo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("CorporateReview not found: " + id));

		// Update fields one by one (no surprises)
		existing.setEmployeeName(incoming.getEmployeeName());
		existing.setCompany(incoming.getCompany());
		existing.setRole(incoming.getRole());
		existing.setEmployeeRating(incoming.getEmployeeRating());
		existing.setLocation(incoming.getLocation());
		existing.setCourseName(incoming.getCourseName());
		existing.setComment(incoming.getComment());
		existing.setCategoryName(incoming.getCategoryName());

		if (companyLogo != null && !companyLogo.isEmpty()) {
			// delete old file safely
			deleteExistingLogoIfAny(existing.getCompanyLogo());
			String stored = storeLogo(companyLogo);
			existing.setCompanyLogo(stored);
		}

		return repo.save(existing);
	}

	@Override
	public void delete(int id) {
		CorporateReview existing = repo.findById(id)
				.orElseThrow(() -> new IllegalArgumentException("CorporateReview not found: " + id));

		deleteExistingLogoIfAny(existing.getCompanyLogo());
		repo.delete(existing);
	}

	@Override
	@Transactional(readOnly = true)
	public Resource loadLogoAsResource(String filename) {
		try {
			Path base = Paths.get(uploadPath).normalize().toAbsolutePath();
			Path filePath = base.resolve(filename).normalize();

			// Prevent path traversal
			if (!filePath.startsWith(base)) {
				throw new SecurityException("Invalid path traversal in filename: " + filename);
			}

			Resource resource = new UrlResource(filePath.toUri());
			if (!resource.exists()) {
				return null;
			}
			return resource;
		} catch (MalformedURLException | InvalidPathException e) {
			return null;
		}
	}

	// ------------- helpers -------------

	private CorporateReview readJson(String json) {
		try {
			return mapper.readValue(json, CorporateReview.class);
		} catch (IOException e) {
			throw new IllegalArgumentException("Invalid review JSON: " + e.getMessage(), e);
		}
	}

	private String storeLogo(MultipartFile file) {
		try {
			ensureDir();

			// Sanitize + unique filename
			String ext = FilenameUtils.getExtension(file.getOriginalFilename());
			String base = FilenameUtils.getBaseName(file.getOriginalFilename());
			base = base.replaceAll("[^a-zA-Z0-9-_\\.]", "_"); // simple sanitize
			String uniqueName = base + "_" + UUID.randomUUID() + (ext != null && !ext.isBlank() ? "." + ext : "");

			// Optional: validate size and mime-type
			// long maxSize = 3 * 1024 * 1024; // 3MB
			// if (file.getSize() > maxSize) throw new IllegalArgumentException("Logo too
			// large");

			Path dest = Paths.get(uploadPath).toAbsolutePath().normalize().resolve(uniqueName);
			Files.write(dest, file.getBytes());

			// Value stored in DB, mirroring your UserReview approach
			return "logos/" + uniqueName;
		} catch (IOException e) {
			throw new RuntimeException("Failed to store company logo: " + e.getMessage(), e);
		}
	}

	private void ensureDir() throws IOException {
		Path dir = Paths.get(uploadPath).toAbsolutePath().normalize();
		if (!Files.exists(dir)) {
			Files.createDirectories(dir);
		}
	}

	private void deleteExistingLogoIfAny(String logoPathValue) {
		if (logoPathValue == null || logoPathValue.isBlank())
			return;

		// stored as "logos/<filename>", map to disk path: uploadPath + <filename>
		String fileNameOnly = logoPathValue.replaceFirst("^logos/", "");
		File old = new File(uploadPath, fileNameOnly);
		if (old.exists() && !old.delete()) {
			// log only; do not fail the request for a delete miss
			System.err.println("Failed to delete old logo: " + old.getAbsolutePath());
		}
	}
}