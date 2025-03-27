//package com.hachionUserDashboard.controller;
//
//import java.io.File;
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.time.LocalDate;
//import java.util.List;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.hachionUserDashboard.entity.Banner;
//import com.hachionUserDashboard.entity.Blogs;
//import com.hachionUserDashboard.repository.BannerRepository;
//
//@RequestMapping
//@CrossOrigin
////@CrossOrigin(origins ="http://localhost:3000")
//@RestController
//public class BannerController {
//
// 
//
//    @Autowired
//    private BannerRepository repo;
//
//    @GetMapping("/banner/{id}")
//    public ResponseEntity<Banner> getBanner(@PathVariable Integer id) {
//        return repo.findById(id)
//                   .map(ResponseEntity::ok)
//                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//
//    @GetMapping("/banner")
//    public List<Banner> getAllBanner() {
//        return repo.findAll();
//    }
//
//
//    @PostMapping("/banner/add")
//    @ResponseStatus(code = HttpStatus.CREATED)
//    public ResponseEntity<String> createBanner(
//        @RequestParam("banner_image") MultipartFile banner,
//        @RequestParam("home_banner_image") MultipartFile home_banner,
//        @RequestParam("amount_conversion") String amount_conversion,
//        @RequestParam("country") String country,
//        @RequestParam("date") String date // LocalDate in "yyyy-MM-dd" format
//    ) {
//        try {
//            // Define directories for saving files
//            String uploadDir = "uploads/";
//            Path imagePath = Paths.get(uploadDir + "images/");
//            
//            // Create directories if they don't exist
//            Files.createDirectories(imagePath);
//
//            // Save banner image file
//            String bannerFileName = "images/" + banner.getOriginalFilename();
//            Files.write(Paths.get(uploadDir + bannerFileName), banner.getBytes());
//
//            // Save home banner image file
//            String homeBannerFileName = "images/" + home_banner.getOriginalFilename();
//            Files.write(Paths.get(uploadDir + homeBannerFileName), home_banner.getBytes());
//
//            // Create Banner entity and set its properties
//            Banner banner1 = new Banner();
//           
//            banner1.setCountry(country);
//            banner1.setAmount_conversion(amount_conversion);
//            banner1.setStatus("disable");
//            banner1.setType("amount conversion");
//            banner1.setDate(LocalDate.parse(date));
//            banner1.setBanner_image(bannerFileName);
//            banner1.setHome_banner_image(homeBannerFileName);
//
//            // Save banner to the database
//            repo.save(banner1);
//
//            return ResponseEntity.status(HttpStatus.CREATED).body("Banner added successfully!");
//
//        } catch (IOException e) {
//            e.printStackTrace(); // Log the error for debugging
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving files: " + e.getMessage());
//        }
//    }
//
//    @PutMapping("/banner/update/{id}")
//    public ResponseEntity<Banner> updateBanner(@PathVariable int id, @RequestBody Banner updatedBanner) {
//        return repo.findById(id).map(banner -> {
//            banner.setBanner_image(updatedBanner.getBanner_image());
//            banner.setHome_banner_image(updatedBanner.getHome_banner_image());
//            banner.setAmount_conversion(updatedBanner.getAmount_conversion());
//            banner.setCountry(updatedBanner.getCountry());
//            banner.setStatus(updatedBanner.getStatus());
//            repo.save(banner);
//            return ResponseEntity.ok(banner);
//        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//
//    @DeleteMapping("/banner/delete/{id}")
//    public ResponseEntity<?> deleteBlog(@PathVariable int id) {
//        return repo.findById(id).map(banner -> {
//            repo.delete(banner);
//            return ResponseEntity.ok("Banner deleted successfully");
//        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//
//}
package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hachionUserDashboard.entity.Banner;
import com.hachionUserDashboard.entity.Blogs;
import com.hachionUserDashboard.entity.UserReview;
import com.hachionUserDashboard.repository.BannerRepository;

@RequestMapping
@CrossOrigin
//@CrossOrigin(origins ="http://localhost:3000")
@RestController
public class BannerController {

 

    @Autowired
    private BannerRepository repo;

    @GetMapping("/banner/{id}")
    public ResponseEntity<Banner> getBanner(@PathVariable Integer id) {
        return repo.findById(id)
                   .map(ResponseEntity::ok)
                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @GetMapping("/banner")
    public List<Banner> getAllBanner() {
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
            return "images/" + image.getOriginalFilename();  // Save relative path in DB
        }
        return null;
    }
    @PostMapping("/banner/add")
    public ResponseEntity<String> addBanner(
            @RequestPart("banner") String bannerData,
            @RequestPart(value = "banner_image", required = false) MultipartFile bannerImage,
            @RequestPart(value = "home_banner_image", required = false) MultipartFile homeBannerImage) {
        try {
            // Parse the banner data (excluding images)
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule());
            Banner banner = objectMapper.readValue(bannerData, Banner.class);

            // Process the banner image
            if (bannerImage != null && !bannerImage.isEmpty()) {
                String bannerImagePath = saveImage(bannerImage);
                if (bannerImagePath != null) {
                    banner.setBanner_image(bannerImagePath);
                } else {
                    return ResponseEntity.badRequest().body("Failed to save banner image.");
                }
            } else {
                banner.setBanner_image(""); // Set empty string if no image is provided
            }

            // Process the home banner image
            if (homeBannerImage != null && !homeBannerImage.isEmpty()) {
                String homeBannerImagePath = saveImage(homeBannerImage);
                if (homeBannerImagePath != null) {
                    banner.setHome_banner_image(homeBannerImagePath);
                } else {
                    return ResponseEntity.badRequest().body("Failed to save home banner image.");
                }
            } else {
                banner.setHome_banner_image(""); // Set empty string if no image is provided
            }

            // Save the banner data to the database
            repo.save(banner);

            // Respond with a success message
            return ResponseEntity.status(HttpStatus.CREATED).body("Banner added successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding banner: " + e.getMessage());
        }
    }

//    @PostMapping("/banner/add")
//    @ResponseStatus(code = HttpStatus.CREATED)
//    public ResponseEntity<String> createBanner(
//        @RequestParam("banner_image") MultipartFile banner,
//        @RequestParam("home_banner_image") MultipartFile home_banner,
//        @RequestParam("amount_conversion") String amount_conversion,
//        @RequestParam("country") String country,
//        @RequestParam("date") String date // LocalDate in "yyyy-MM-dd" format
//    ) {
//        try {
//            // Define directories for saving files
//            String uploadDir = "uploads/";
//            Path imagePath = Paths.get(uploadDir + "images/");
//            
//            // Create directories if they don't exist
//            Files.createDirectories(imagePath);
//
//            // Save banner image file
//            String bannerFileName = "images/" + banner.getOriginalFilename();
//            Files.write(Paths.get(uploadDir + bannerFileName), banner.getBytes());
//
//            // Save home banner image file
//            String homeBannerFileName = "images/" + home_banner.getOriginalFilename();
//            Files.write(Paths.get(uploadDir + homeBannerFileName), home_banner.getBytes());
//
//            // Create Banner entity and set its properties
//            Banner banner1 = new Banner();
//           
//            banner1.setCountry(country);
//            banner1.setAmount_conversion(amount_conversion);
//            banner1.setStatus("disable");
//            banner1.setType("amount conversion");
//            banner1.setDate(LocalDate.parse(date));
//            banner1.setBanner_image(bannerFileName);
//            banner1.setHome_banner_image(homeBannerFileName);
//
//            // Save banner to the database
//            repo.save(banner1);
//
//            return ResponseEntity.status(HttpStatus.CREATED).body("Banner added successfully!");
//
//        } catch (IOException e) {
//            e.printStackTrace(); // Log the error for debugging
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error saving files: " + e.getMessage());
//        }
//    }

    @PutMapping("/banner/update/{id}")
    public ResponseEntity<String> updateBanner(
            @PathVariable int id,
            @RequestPart("banner") String bannerData,
            @RequestPart(value = "banner_image", required = false) MultipartFile bannerImage,
            @RequestPart(value = "home_banner_image", required = false) MultipartFile homeBannerImage) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule()); // Support for Java 8 Date/Time types
            Banner updatedBanner = objectMapper.readValue(bannerData, Banner.class);

            return repo.findById(id).map(banner -> {
                // Update non-image fields
                banner.setAmount_conversion(updatedBanner.getAmount_conversion());
                banner.setCountry(updatedBanner.getCountry());
                banner.setStatus(updatedBanner.getStatus());
                banner.setType(updatedBanner.getType());

                try {
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

                repo.save(banner); // Save the updated banner
                return ResponseEntity.ok("Banner updated successfully.");
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Banner not found."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error updating banner: " + e.getMessage());
        }
    }

    @DeleteMapping("/banner/delete/{id}")
    public ResponseEntity<?> deleteBanner(@PathVariable int id) {
        return repo.findById(id).map(banner -> {
            repo.delete(banner);
            return ResponseEntity.ok("Banner deleted successfully");
        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

}
