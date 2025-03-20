//
//package com.hachionUserDashboard.controller;
//
//import java.io.File;
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.nio.file.Paths;
//import java.time.LocalDate;
//import java.util.List;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.CrossOrigin;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RequestPart;
//import org.springframework.web.bind.annotation.ResponseStatus;
//import org.springframework.web.bind.annotation.RestController;
//import org.springframework.web.multipart.MultipartFile;
//
//import com.fasterxml.jackson.databind.ObjectMapper;
//import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
//import com.hachionUserDashboard.entity.Blogs;
//import com.hachionUserDashboard.entity.Course;
//import com.hachionUserDashboard.repository.CourseRepository;
//import com.hachionUserDashboard.repository.CurriculumRepository;
//
//@CrossOrigin
////@CrossOrigin(origins ="http://localhost:3000")
//@RestController
//public class CourseController {
//
//    
//
//    @Autowired
//    private CourseRepository repo;
//
//    @GetMapping("/courses/{id}")
//    public ResponseEntity<Course> getCourse(@PathVariable Integer id) {
//        return repo.findById(id)
//                   .map(ResponseEntity::ok)
//                   .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
//    }
//
//    @GetMapping("/courses/all")
//    public List<Course> getAllCourse() {
//        return repo.findAll();
//    }
//
//    private final String uploadDir = System.getProperty("user.home") + "/uploads/";
//
//
//    // Method to upload image file
//    private String saveImage(MultipartFile image) throws IOException {
//        if (image != null && !image.isEmpty()) {
//            // Ensure the image directory exists
//            File directory = new File(uploadDir + "images/");
//            if (!directory.exists()) {
//                directory.mkdirs(); // Create directories if they do not exist
//            }
//
//            Path imagePath = Paths.get(directory.getAbsolutePath(), image.getOriginalFilename());
//            Files.write(imagePath, image.getBytes()); // Save image to disk
//            return "images/" + image.getOriginalFilename();  // Save relative path in DB
//        }
//        return null;
//    }
//
//
//
//    @PostMapping("/courses/add")
//    public ResponseEntity<String> addCourse(
//            @RequestParam("course") String courseData,
//            @RequestParam("courseImage") MultipartFile courseImage) {
//        try {
//            // Parse the course data (course details, excluding image)
//            ObjectMapper objectMapper = new ObjectMapper();
//            objectMapper.registerModule(new JavaTimeModule()); // Register the module for Java 8 Date/Time types
//          
//   
//            Course course = objectMapper.readValue(courseData, Course.class);
//
//            // Process the image
//            if (!courseImage.isEmpty()) {
//                // Save the image and get the relative path
//                String imagePath = saveImage(courseImage);
//                if (imagePath != null) {
//                    course.setCourseImage(imagePath);  // Save image path in the course object
//                } else {
//                    return ResponseEntity.badRequest().body("Failed to save image.");
//                }
//            } else {
//                return ResponseEntity.badRequest().body("Course image is required.");
//            }
//
//            // Save the course data to the database
//            repo.save(course);
//
//            // Respond with a success message
//            return ResponseEntity.status(HttpStatus.CREATED).body("Course added successfully.");
//        } catch (Exception e) {
//            // Log the full stack trace of the error
//            e.printStackTrace();
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding course: " + e.getMessage());
//        }
//    }
//
//
//    @PutMapping("/courses/update/{id}")
//    public ResponseEntity<String> updateCourse(
//            @PathVariable int id,
//            @RequestParam("course") String courseData,
//            @RequestParam(value = "courseImage", required = false) MultipartFile courseImage) {
//        try {
//            // Parse the course data (excluding image) 
//            ObjectMapper objectMapper = new ObjectMapper();
//            objectMapper.registerModule(new JavaTimeModule()); // Register the module for Java 8 Date/Time types
//            Course updatedCourse = objectMapper.readValue(courseData, Course.class);
//            
//        return repo.findById(id).map(course -> {
//        	course.setCourseCategory(updatedCourse.getCourseCategory());
//        	
//        	course.setCourseName(updatedCourse.getCourseName());
//        	course.setDailySessions(updatedCourse.getDailySessions());
//        	course.setLabExerciseHours(updatedCourse.getLabExerciseHours());
//        	course.setLiveTrainingHours(updatedCourse.getLiveTrainingHours());
//        	course.setNumberOfClasses(updatedCourse.getNumberOfClasses());
//        	course.setRatingByNumberOfPeople(updatedCourse.getRatingByNumberOfPeople());
//        	course.setRealTimeProjects(updatedCourse.getRealTimeProjects());
//        	course.setStarRating(updatedCourse.getStarRating());
//        	course.setTotalEnrollment(updatedCourse.getTotalEnrollment());
//        	course.setYoutubeLink(updatedCourse.getYoutubeLink());
//        	course.setKeyHighlights1(updatedCourse.getKeyHighlights1());
//        	course.setKeyHighlights2(updatedCourse.getKeyHighlights2());
//        	course.setKeyHighlights3(updatedCourse.getKeyHighlights3());
//        	course.setKeyHighlights4(updatedCourse.getKeyHighlights4());
//        	course.setKeyHighlights5(updatedCourse.getKeyHighlights5());
//        	course.setKeyHighlights6(updatedCourse.getKeyHighlights6());
//        	course.setAmount(updatedCourse.getAmount());
//        	course.setDiscount(updatedCourse.getDiscount());
//        	course.setTotal(updatedCourse.getTotal());
//        	course.setMentoring1(updatedCourse.getMentoring1());
//        	course.setMentoring2(updatedCourse.getMentoring2());
//        	course.setSelf1(updatedCourse.getSelf1());
//        	course.setSelf2(updatedCourse.getSelf2());
//        	course.setHeaderTitle(updatedCourse.getHeaderTitle());
//        	course.setCourseHighlight(updatedCourse.getCourseHighlight());
//        	course.setCourseKeyword(updatedCourse.getCourseKeyword());
//        	course.setCourseKeywordDescription(updatedCourse.getCourseKeywordDescription());
//        	course.setCourseDescription(updatedCourse.getCourseDescription());
//         
//         
//        	if (courseImage != null && !courseImage.isEmpty()) {
//                // Save the new image and update the image path
//                String imagePath = null;
//				try {
//					imagePath = saveImage(courseImage);
//				} catch (IOException e) {
//					// TODO Auto-generated catch block
//					e.printStackTrace();
//				} // saveImage is your method for saving images
//                if (imagePath != null) {
//                    course.setCourseImage(imagePath);  // Save new image path in the course
//                } else {
//                    return ResponseEntity.badRequest().body("Failed to save the new image.");
//                }
//            }
//
//            // Save the updated course in the database
//            repo.save(course);
//
//            // Return success response
//            return ResponseEntity.ok("Course updated successfully.");
//        }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found."));
//    } catch (Exception e) {
//        e.printStackTrace();
//        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating course: " + e.getMessage());
//    }
//}
//
//    @DeleteMapping("courses/delete/{id}") public ResponseEntity<?>
//    deleteCourse(@PathVariable int id) { Course course=
//    repo.findById(id).get(); repo.delete(course); return null;
//    
//    }
//}
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
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hachionUserDashboard.entity.Course;
import com.hachionUserDashboard.repository.CourseRepository;

@CrossOrigin
@RestController
@RequestMapping("/courses")
public class CourseController {

    @Autowired
    private CourseRepository repo;
    @GetMapping("/{id}")
  public ResponseEntity<Course> getCourse(@PathVariable Integer id) {
      return repo.findById(id)
                 .map(ResponseEntity::ok)
                .orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
 }

 @GetMapping("/all")
  public List<Course> getAllCourse() {
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

    @PostMapping("/add")
    public ResponseEntity<String> addCourse(
            @RequestPart("course") String courseData,
            @RequestPart("courseImage") MultipartFile courseImage) {
        try {
            // Parse the course data (course details, excluding image)
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule()); // Register the module for Java 8 Date/Time types
            Course course = objectMapper.readValue(courseData, Course.class);

            // Process the image
            if (!courseImage.isEmpty()) {
                // Save the image and get the relative path
                String imagePath = saveImage(courseImage);
                if (imagePath != null) {
                    course.setCourseImage(imagePath);  // Save image path in the course object
                } else {
                    return ResponseEntity.badRequest().body("Failed to save image.");
                }
            } else {
                return ResponseEntity.badRequest().body("Course image is required.");
            }

            // Save the course data to the database
            repo.save(course);

            // Respond with a success message
            return ResponseEntity.status(HttpStatus.CREATED).body("Course added successfully.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error adding course: " + e.getMessage());
        }
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<String> updateCourse(
            @PathVariable int id,
            @RequestPart("course") String courseData,
            @RequestPart(value = "courseImage", required = false) MultipartFile courseImage) {
        try {
            // Parse the course data (excluding image)
            ObjectMapper objectMapper = new ObjectMapper();
            objectMapper.registerModule(new JavaTimeModule()); // Register the module for Java 8 Date/Time types
            Course updatedCourse = objectMapper.readValue(courseData, Course.class);

            return repo.findById(id).map(course -> {
                // Update fields with the new course data
                course.setCourseCategory(updatedCourse.getCourseCategory());
                course.setCourseName(updatedCourse.getCourseName());
                course.setDailySessions(updatedCourse.getDailySessions());
               
                course.setNumberOfClasses(updatedCourse.getNumberOfClasses());
                course.setRatingByNumberOfPeople(updatedCourse.getRatingByNumberOfPeople());
         
                course.setStarRating(updatedCourse.getStarRating());
                course.setTotalEnrollment(updatedCourse.getTotalEnrollment());
                course.setYoutubeLink(updatedCourse.getYoutubeLink());
                course.setKeyHighlights1(updatedCourse.getKeyHighlights1());
                course.setKeyHighlights2(updatedCourse.getKeyHighlights2());
                course.setKeyHighlights3(updatedCourse.getKeyHighlights3());
                course.setKeyHighlights4(updatedCourse.getKeyHighlights4());
                course.setKeyHighlights5(updatedCourse.getKeyHighlights5());
                course.setKeyHighlights6(updatedCourse.getKeyHighlights6());
                course.setAmount(updatedCourse.getAmount());
                course.setDiscount(updatedCourse.getDiscount());
                course.setTotal(updatedCourse.getTotal());
                course.setCamount(updatedCourse.getCamount());
                course.setCdiscount(updatedCourse.getCdiscount());
                course.setCtotal(updatedCourse.getCtotal());
                course.setMamount(updatedCourse.getMamount());
                course.setMdiscount(updatedCourse.getMdiscount());
                course.setMtotal(updatedCourse.getMtotal());
                course.setSamount(updatedCourse.getStotal());
                course.setSdiscount(updatedCourse.getSdiscount());
                course.setStotal(updatedCourse.getStotal());
                course.setMentoring1(updatedCourse.getMentoring1());
                course.setMentoring2(updatedCourse.getMentoring2());
                course.setSelf1(updatedCourse.getSelf1());
                course.setSelf2(updatedCourse.getSelf2());
                course.setMetaTitle(updatedCourse.getMetaTitle());
                course.setCourseHighlight(updatedCourse.getCourseHighlight());
                course.setMetaKeyword(updatedCourse.getMetaKeyword());
                course.setMetaDescription(updatedCourse.getMetaDescription());
                course.setCourseHighlight(updatedCourse.getCourseHighlight());
                course.setCourseDescription(updatedCourse.getCourseDescription());

                if (courseImage != null && !courseImage.isEmpty()) {
                    // Save the new image and update the image path
                    String imagePath = null;
                    try {
                        imagePath = saveImage(courseImage);
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                    if (imagePath != null) {
                        course.setCourseImage(imagePath);  // Save new image path in the course
                    } else {
                        return ResponseEntity.badRequest().body("Failed to save the new image.");
                    }
                }

                // Save the updated course in the database
                repo.save(course);

                // Return success response
                return ResponseEntity.ok("Course updated successfully.");
            }).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found."));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating course: " + e.getMessage());
        }
    }
    @DeleteMapping("/delete/{id}") public ResponseEntity<?>
  deleteCourse(@PathVariable int id) { Course course=
  repo.findById(id).get(); repo.delete(course); return null;
  
  }
}

