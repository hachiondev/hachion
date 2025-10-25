package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hachionUserDashboard.entity.UserReview;
import com.hachionUserDashboard.repository.UserReviewRepository;

@RequestMapping

@CrossOrigin
@RestController
public class UserReviewController {

	@Value("${image.upload.userreview.path}")
	private String uploadPath;

	@Autowired
	private UserReviewRepository repo;

	@GetMapping("/userreview/{id}")
	public ResponseEntity<UserReview> getUserReview(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/userreview")
	public List<UserReview> getAllUserReview() {
		return repo.findAll();
	}

	@GetMapping("/userreview/active")
	public List<UserReview> getAllActiveUserReviews() {
		return repo.findAllByTypeTrue();
	}

	@GetMapping("/userreview/instructor/{courseName}")
	public List<UserReview> getReviewsByCourse(@PathVariable String courseName) {
		return repo.findByCourseName(courseName);
	}

	private String saveImage(MultipartFile image) throws IOException {
		if (image != null && !image.isEmpty()) {
			File directory = new File(uploadPath);
			if (!directory.exists()) {
				directory.mkdirs();
			}

			Path imagePath = Paths.get(directory.getAbsolutePath(), image.getOriginalFilename());
			Files.write(imagePath, image.getBytes());

			return "images/" + image.getOriginalFilename();
		}
		return null;
	}

	@PostMapping("userreview/add")
	public ResponseEntity<String> addReview(@RequestPart("review") String reviewData,
			@RequestPart(value = "user_image", required = false) MultipartFile user_image) {
		try {

			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			UserReview userreview = objectMapper.readValue(reviewData, UserReview.class);

			if (user_image != null && !user_image.isEmpty()) {
				String imagePath = saveImage(user_image);
				if (imagePath != null) {
					userreview.setUser_image(imagePath);
				} else {
					return ResponseEntity.badRequest().body("Failed to save image.");
				}
			} else {
				userreview.setUser_image("");
			}

			repo.save(userreview);

			return ResponseEntity.status(HttpStatus.CREATED).body("Review added successfully.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error adding review: " + e.getMessage());
		}
	}

	@PutMapping("userreview/update/{id}")
	public ResponseEntity<String> updateReview(@PathVariable int id, @RequestPart("review") String reviewData,
			@RequestPart(value = "user_image", required = false) MultipartFile user_image) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			UserReview updatedUserReview = objectMapper.readValue(reviewData, UserReview.class);

			return repo.findById(id).map(userReview -> {

				userReview.setName(updatedUserReview.getName());
				userReview.setEmail(updatedUserReview.getEmail());
				userReview.setLocation(updatedUserReview.getLocation());
				userReview.setCourse_name(updatedUserReview.getCourse_name());
				userReview.setRating(updatedUserReview.getRating());
				userReview.setSocial_id(updatedUserReview.getSocial_id());
				userReview.setTrainer_name(updatedUserReview.getTrainer_name());
				userReview.setReview(updatedUserReview.getReview());
				userReview.setType(updatedUserReview.isType());
				userReview.setDisplay(updatedUserReview.getDisplay());
				userReview.setStatus(updatedUserReview.getStatus());
				userReview.setVideoLink(updatedUserReview.getVideoLink());
				userReview.setReviewType(updatedUserReview.getReviewType());

				if (user_image != null && !user_image.isEmpty()) {
					try {

						String oldImagePath = userReview.getUser_image();
						if (oldImagePath != null) {
							File oldFile = new File(oldImagePath);
							if (oldFile.exists()) {
								if (!oldFile.delete()) {
									System.err.println("Failed to delete old image: " + oldImagePath);
								}
							}
						}

						String imagePath = saveImage(user_image);
						if (imagePath != null) {
							userReview.setUser_image(imagePath);
						} else {
							return ResponseEntity.badRequest().body("Failed to save the new image.");
						}
					} catch (IOException e) {
						e.printStackTrace();
						return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
								.body("Error saving image: " + e.getMessage());
					}
				}
				repo.save(userReview);
				return ResponseEntity.ok("Review updated successfully.");
			}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found."));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error updating review: " + e.getMessage());
		}
	}

	@DeleteMapping("userreview/delete/{id}")
	public ResponseEntity<String> deleteUserReview(@PathVariable int id) {
		return repo.findById(id).map(userReview -> {

			String imageName = userReview.getUser_image();
			if (imageName != null && !imageName.trim().isEmpty()) {

				String fileNameOnly = imageName.replaceFirst("^images/", "");

				File oldImage = new File(uploadPath, fileNameOnly);

				if (oldImage.exists()) {
					boolean deleted = oldImage.delete();
					if (!deleted) {
						System.err.println("Failed to delete image: " + oldImage.getAbsolutePath());
					}
				}
			}

			repo.delete(userReview);
			return ResponseEntity.ok("Review deleted successfully.");
		}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found."));
	}

	@GetMapping("userreview/images/{filename:.+}")
	public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {

		Path filePath = Paths.get(uploadPath).resolve(filename).normalize();
		Resource resource = new UrlResource(filePath.toUri());

		if (!resource.exists()) {
			return ResponseEntity.notFound().build();
		}

		String contentType = Files.probeContentType(filePath);
		if (contentType == null) {
			contentType = "application/octet-stream";
		}

		return ResponseEntity.ok().contentType(MediaType.parseMediaType(contentType)).body(resource);
	}

}
