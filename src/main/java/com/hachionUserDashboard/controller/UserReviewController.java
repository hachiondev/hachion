package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
//@CrossOrigin(origins = {"http://localhost:3000", "http://hachion.co"})
@CrossOrigin
@RestController
public class UserReviewController {

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

	private final String uploadDir = System.getProperty("user.home") + "/uploads/";

	// Method to upload image file
	private String saveImage(MultipartFile image) throws IOException {
		if (image != null && !image.isEmpty()) {
			// Ensure the image directory exists
			File directory = new File(uploadDir + "images/");
			if (!directory.exists()) {
				directory.mkdirs(); // Create directories if they do not exist
			}

			Path imagePath = Paths.get(directory.getAbsolutePath(), image.getOriginalFilename());
			Files.write(imagePath, image.getBytes()); // Save image to disk
			return "images/" + image.getOriginalFilename(); // Save relative path in DB
		}
		return null;
	}

	@PostMapping("userreview/add")
	public ResponseEntity<String> addReview(@RequestPart("review") String reviewData,
			@RequestPart(value = "user_image", required = false) MultipartFile user_image) {
		try {
			// Parse the review data (excluding image)
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule()); // Support for Java 8 Date/Time types
			UserReview userreview = objectMapper.readValue(reviewData, UserReview.class);

			// Process the image if provided, otherwise set an empty string
			if (user_image != null && !user_image.isEmpty()) {
				String imagePath = saveImage(user_image);
				if (imagePath != null) {
					userreview.setUser_image(imagePath);
				} else {
					return ResponseEntity.badRequest().body("Failed to save image.");
				}
			} else {
				userreview.setUser_image(""); // Set empty string if no image is provided
			}

			// Save the review data to the database
			repo.save(userreview);

			// Respond with a success message
			return ResponseEntity.status(HttpStatus.CREATED).body("Review added successfully.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error adding review: " + e.getMessage());
		}
	}

//    @PostMapping("/userreview/add")
//    @ResponseStatus(code = HttpStatus.CREATED)
//    public void createUserReview(@RequestBody UserReview userReview) {
//        repo.save(userReview);
//    }

//    @PutMapping("/userreview/update/{id}")
//    public ResponseEntity<UserReview> updateUserReview(@PathVariable int id, @RequestBody UserReview updatedUserReview) {
	@PutMapping("userreview/update/{id}")
	public ResponseEntity<String> updateReview(@PathVariable int id, @RequestPart("review") String reviewData,
			@RequestPart(value = "user_image", required = false) MultipartFile user_image) {
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule()); // Register Java 8 Date/Time module
			UserReview updatedUserReview = objectMapper.readValue(reviewData, UserReview.class);

			return repo.findById(id).map(userReview -> {
				// Update fields
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
				// Check if a new image is uploaded
				if (user_image != null && !user_image.isEmpty()) {
					try {
						String imagePath = saveImage(user_image); // Save new image
						if (imagePath != null) {
							userReview.setUser_image(imagePath); // Update image path
						} else {
							return ResponseEntity.badRequest().body("Failed to save the new image.");
						}
					} catch (IOException e) {
						e.printStackTrace();
						return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
								.body("Error saving image: " + e.getMessage());
					}
				}
				// If no new image is uploaded, keep the existing one

				repo.save(userReview); // Save updated review
				return ResponseEntity.ok("Review updated successfully.");
			}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found."));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error updating review: " + e.getMessage());
		}
	}

//            repo.save(userReview);
//            return ResponseEntity.ok(userReview);
//        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }

	@DeleteMapping("userreview/delete/{id}")
	public ResponseEntity<String> deleteUserReview(@PathVariable int id) {
		return repo.findById(id).map(userReview -> {
			repo.delete(userReview);
			return ResponseEntity.ok("Review deleted successfully.");
		}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Review not found."));
	}

}
