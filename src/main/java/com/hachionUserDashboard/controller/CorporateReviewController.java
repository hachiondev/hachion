package com.hachionUserDashboard.controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.hachionUserDashboard.entity.CorporateReview;

import Service.CorporateReviewService;

@CrossOrigin
@RequestMapping
@RestController
public class CorporateReviewController {

	@Autowired
	private CorporateReviewService corporateReviewService;

	@Value("${image.upload.corporatereview.path}")
	private String uploadPath;

	@GetMapping("/corporatereview/{id}")
	public ResponseEntity<CorporateReview> getById(@PathVariable int id) {
		return corporateReviewService.getById(id).map(ResponseEntity::ok)
				.orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/corporatereview")
	public List<CorporateReview> getAll() {
		return corporateReviewService.getAll();
	}

	@GetMapping("/corporatereview/course/{courseName}")
	public List<CorporateReview> getByCourse(@PathVariable String courseName) {
		return corporateReviewService.getByCourseName(courseName);
	}

	@PostMapping("/corporatereview/add")
	public ResponseEntity<String> add(@RequestPart("review") String reviewJson,
			@RequestPart(value = "company_logo", required = false) MultipartFile companyLogo) {
		try {
			corporateReviewService.add(reviewJson, companyLogo);
			return ResponseEntity.status(HttpStatus.CREATED).body("Corporate review added successfully.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error adding corporate review: " + e.getMessage());
		}
	}

	@PutMapping("/corporatereview/update/{id}")
	public ResponseEntity<String> update(@PathVariable int id, @RequestPart("review") String reviewJson,
			@RequestPart(value = "company_logo", required = false) MultipartFile companyLogo) {
		try {
			corporateReviewService.update(id, reviewJson, companyLogo);
			return ResponseEntity.ok("Corporate review updated successfully.");
		} catch (IllegalArgumentException notFound) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(notFound.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error updating corporate review: " + e.getMessage());
		}
	}

	@DeleteMapping("/corporatereview/delete/{id}")
	public ResponseEntity<String> delete(@PathVariable int id) {
		try {
			corporateReviewService.delete(id);
			return ResponseEntity.ok("Corporate review deleted successfully.");
		} catch (IllegalArgumentException notFound) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body(notFound.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error deleting corporate review: " + e.getMessage());
		}
	}

	@GetMapping("/corporatereview/logos/{filename:.+}")
	public ResponseEntity<Resource> getLogo(@PathVariable String filename) throws IOException {
		Resource resource = corporateReviewService.loadLogoAsResource(filename);
		if (resource == null) {
			return ResponseEntity.notFound().build();
		}

		// Try to determine content type from the actual file path under uploadPath
		Path filePath = Path.of(uploadPath).resolve(filename).normalize();
		String contentType = Files.probeContentType(filePath);
		if (contentType == null)
			contentType = MediaType.APPLICATION_OCTET_STREAM_VALUE;

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
	}
}