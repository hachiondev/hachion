package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
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
import com.hachionUserDashboard.entity.Banner;
import com.hachionUserDashboard.repository.BannerRepository;

@RequestMapping
@CrossOrigin
@RestController
public class BannerController {

	@Autowired
	private BannerRepository repo;

	@Value("${banner.image.upload.path}")
	private String uploadDir;

	@GetMapping("/banner/{id}")
	public ResponseEntity<Banner> getBanner(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/banner")
	public List<Banner> getAllBanner() {
		return repo.findAll();
	}

//	private final String uploadDir = System.getProperty("user.home") + "/uploads/";

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

	@PostMapping("/banner/add")
	public ResponseEntity<String> addBanner(@RequestPart("banner") String bannerData,
			@RequestPart(value = "banner_image", required = false) MultipartFile bannerImage,
			@RequestPart(value = "home_banner_image", required = false) MultipartFile homeBannerImage) {
		try {
			// Parse the banner data
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			Banner banner = objectMapper.readValue(bannerData, Banner.class);

			// Set the path field (Example: Default or from request data)
			if (banner.getPath() == null || banner.getPath().isEmpty()) {
				banner.setPath(""); // You can replace with actual logic
			}

			// Process banner image (if available)
			if (bannerImage != null && !bannerImage.isEmpty()) {
				String bannerImagePath = saveImage(bannerImage);
				if (bannerImagePath != null) {
					banner.setBanner_image(bannerImagePath);
				} else {
					return ResponseEntity.badRequest().body("Failed to save banner image.");
				}
			}

			// Process home banner image (if available)
			if (homeBannerImage != null && !homeBannerImage.isEmpty()) {
				String homeBannerImagePath = saveImage(homeBannerImage);
				if (homeBannerImagePath != null) {
					banner.setHome_banner_image(homeBannerImagePath);
				} else {
					return ResponseEntity.badRequest().body("Failed to save home banner image.");
				}
			}

			// If neither image is provided, allow saving the banner with empty image fields
			if (banner.getBanner_image() == null) {
				banner.setBanner_image(""); // Default empty value
			}
			if (banner.getHome_banner_image() == null) {
				banner.setHome_banner_image(""); // Default empty value
			}

			// Save to database
			repo.save(banner);

			return ResponseEntity.status(HttpStatus.CREATED).body("Banner added successfully.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error adding banner: " + e.getMessage());
		}
	}

	@PutMapping("/banner/update/{id}")
	public ResponseEntity<String> updateBanner(@PathVariable int id, @RequestPart("banner") String bannerData,
			@RequestPart(value = "banner_image", required = false) MultipartFile bannerImage,
			@RequestPart(value = "home_banner_image", required = false) MultipartFile homeBannerImage)

	{
		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule()); // Support for Java 8 Date/Time types
			Banner updatedBanner = objectMapper.readValue(bannerData, Banner.class);

			return repo.findById(id).map(banner -> {
				// **Update status and home_status**
				banner.setStatus(updatedBanner.getStatus());
				banner.setHome_status(updatedBanner.getHome_status());

				// Set the path field (Example: Default or from request data)
				// Ensure the user-inputted path is correctly set
				banner.setPath(
						updatedBanner.getPath() != null && !updatedBanner.getPath().isEmpty() ? updatedBanner.getPath()
								: banner.getPath());

				try {
					// System.out.println("Received banner data: " + bannerData);
					// System.out.println("Banner Image: " + (bannerImage != null ?
					// bannerImage.getOriginalFilename() : "None"));
					// System.out.println("Home Banner Image: " + (homeBannerImage != null ?
					// homeBannerImage.getOriginalFilename() : "None"));
					// If a new banner image is uploaded, update it
					if (bannerImage != null && !bannerImage.isEmpty()) {
						String bannerImagePath = saveImage(bannerImage);
						if (bannerImagePath != null) {
							banner.setBanner_image(bannerImagePath);
						} else {
							return ResponseEntity.badRequest().body("Failed to save banner image.");
						}
					}

					// If a new home banner image is uploaded, update it
					if (homeBannerImage != null && !homeBannerImage.isEmpty()) {
						String homeBannerImagePath = saveImage(homeBannerImage);
						if (homeBannerImagePath != null) {
							banner.setHome_banner_image(homeBannerImagePath);
						} else {
							return ResponseEntity.badRequest().body("Failed to save home banner image.");
						}
					}
				} catch (IOException e) {
					e.printStackTrace();
					return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
							.body("Error saving images: " + e.getMessage());
				}
				System.out.println("Banner Data Received: " + bannerData);
				repo.save(banner); // Save the updated banner
				return ResponseEntity.ok("Banner updated successfully.");
			}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Banner not found."));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error updating banner: " + e.getMessage());
		}
	}

//    @DeleteMapping("/banner/delete/{id}")
//    public ResponseEntity<?> deleteBanner(@PathVariable int id) {
//        return repo.findById(id).map(banner -> {
//            repo.delete(banner);
//            return ResponseEntity.ok("Banner deleted successfully");
//        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }

	@DeleteMapping("/banner/delete/{id}")
	public ResponseEntity<?> deleteBanner(@PathVariable int id) {
		return repo.findById(id).map(banner -> {

			// Delete banner image file
			deleteImageIfExists(banner.getBanner_image());

			// Delete home banner image file
			deleteImageIfExists(banner.getHome_banner_image());

			// Delete DB record
			repo.delete(banner);

			return ResponseEntity.ok("Banner and images deleted successfully");
		}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	private void deleteImageIfExists(String imagePath) {
		if (imagePath == null || imagePath.isEmpty())
			return;

		try {
			Path path = Paths.get(uploadDir, imagePath);
			Files.deleteIfExists(path);
		} catch (IOException e) {
			// Log error but do NOT fail delete
			e.printStackTrace();
		}
	}

}
