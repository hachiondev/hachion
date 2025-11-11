package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hachionUserDashboard.entity.Course;
import com.hachionUserDashboard.exception.ResourceNotFoundException;
import com.hachionUserDashboard.repository.CourseRepository;

@CrossOrigin
@RestController
@RequestMapping("/courses")
public class CourseController {

	@Autowired
	private CourseRepository repo;

	@GetMapping("/{id}")
	public ResponseEntity<Course> getCourse(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/all")
	public List<Course> getAllCourse() {
		return repo.findAll();
	}
	 @GetMapping("/summary")
	    public List<Object[]> getCourseSummaries() {
	        return repo.findAllSummaryNative();
	    }

	private static final String HOME_UPLOADS = System.getProperty("user.home") + "/uploads";

	private static final String TEST_COURSE_DIR = HOME_UPLOADS + "/test/courses/images";

	private static final String TEST_PUBLIC_PREFIX = "uploads/test/courses/images/";

	private String saveImage(MultipartFile image) throws IOException {
		if (image == null || image.isEmpty())
			return null;

		File dir = new File(TEST_COURSE_DIR);
		if (!dir.exists())
			dir.mkdirs();

		String original = image.getOriginalFilename();
		String base = (original == null ? "img_" + System.currentTimeMillis() + ".png" : original);

		base = Paths.get(base).getFileName().toString();

		String safeName = base.replaceAll("\\s+", "_").replaceAll("[^A-Za-z0-9._-]", "");

		Path imagePath = Paths.get(dir.getAbsolutePath(), safeName);
		Files.write(imagePath, image.getBytes());

		return TEST_PUBLIC_PREFIX + safeName;
	}

	@PostMapping("/add")
	public ResponseEntity<String> addCourse(@RequestPart("course") String courseData,
			@RequestPart("courseImage") MultipartFile courseImage) {
		try {

			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			Course course = objectMapper.readValue(courseData, Course.class);

			if (!courseImage.isEmpty()) {

				String imagePath = saveImage(courseImage);
				if (imagePath != null) {
					course.setCourseImage(imagePath);
				} else {
					return ResponseEntity.badRequest().body("Failed to save image.");
				}
			} else {
				return ResponseEntity.badRequest().body("Course image is required.");
			}

			repo.save(course);

			return ResponseEntity.status(HttpStatus.CREATED).body("Course added successfully.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error adding course: " + e.getMessage());
		}
	}

	@PutMapping("/update/{id}")
	public ResponseEntity<String> updateCourse(@PathVariable int id, @RequestPart("course") String courseData,
			@RequestPart(value = "courseImage", required = false) MultipartFile courseImage) {
		try {

			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());
			Course updatedCourse = objectMapper.readValue(courseData, Course.class);

			return repo.findById(id).map(course -> {

				course.setCourseCategory(updatedCourse.getCourseCategory());
				course.setCourseName(updatedCourse.getCourseName());
				course.setShortCourse(updatedCourse.getShortCourse());
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

				course.setSqamount(updatedCourse.getSqamount());
				course.setSqdiscount(updatedCourse.getSqdiscount());
				course.setSqtotal(updatedCourse.getSqtotal());

				course.setIamount(updatedCourse.getIamount());
				course.setIdiscount(updatedCourse.getIdiscount());
				course.setItotal(updatedCourse.getItotal());

				course.setIcamount(updatedCourse.getIcamount());
				course.setIcdiscount(updatedCourse.getIcdiscount());
				course.setIctotal(updatedCourse.getIctotal());

				course.setImamount(updatedCourse.getImamount());
				course.setImdiscount(updatedCourse.getImdiscount());
				course.setImtotal(updatedCourse.getImtotal());

				course.setIsamount(updatedCourse.getIstotal());
				course.setIsdiscount(updatedCourse.getIsdiscount());
				course.setIstotal(updatedCourse.getIstotal());

				course.setIsqamount(updatedCourse.getIsqamount());
				course.setIsqdiscount(updatedCourse.getIsqdiscount());
				course.setIsqtotal(updatedCourse.getIsqtotal());

				course.setMentoring1(updatedCourse.getMentoring1());
				course.setMentoring2(updatedCourse.getMentoring2());
				course.setSelf1(updatedCourse.getSelf1());
				course.setSelf2(updatedCourse.getSelf2());
				course.setMetaTitle(updatedCourse.getMetaTitle());
				course.setCourseHighlight(updatedCourse.getCourseHighlight());
				course.setMetaKeyword(updatedCourse.getMetaKeyword());
				course.setMetaDescription(updatedCourse.getMetaDescription());
				course.setCourseHighlight(updatedCourse.getCourseHighlight());
				course.setAboutCourse(updatedCourse.getAboutCourse());
				course.setCourseDescription(updatedCourse.getCourseDescription());
				course.setLevel(updatedCourse.getLevel());
				
				if (courseImage != null && !courseImage.isEmpty()) {
					try {
						String imagePath = saveImage(courseImage);
						if (imagePath != null) {
							course.setCourseImage(imagePath);
						} else {
							return ResponseEntity.badRequest().body("Failed to save the new image.");
						}
					} catch (IOException e) {
						e.printStackTrace();
						return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
								.body("Image saving error: " + e.getMessage());
					}
				}

				repo.save(course);
				return ResponseEntity.ok("Course updated successfully.");

			}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found."));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error updating course: " + e.getMessage());
		}
	}

	@DeleteMapping("/delete/{id}")
	public ResponseEntity<?> deleteCourse(@PathVariable int id) {
		try {
			return repo.findById(id).map(course -> {
				String publicPath = course.getCourseImage();
				if (publicPath != null && !publicPath.isBlank()) {

					String relative = publicPath.replaceFirst("^uploads/", "");
					Path full = Paths.get(HOME_UPLOADS, relative);
					File f = full.toFile();
					if (f.exists())
						f.delete();
				}

				repo.delete(course);
				return ResponseEntity.ok("Course and image deleted successfully.");
			}).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Course not found."));
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error deleting course.");
		}
	}

	@GetMapping("/category")
	public ResponseEntity<?> getCoursesByCategory(@RequestParam String courseCategory) {
		List<Course> courses = repo.findCoursesByCategory(courseCategory);

		if (courses.isEmpty()) {
			return new ResponseEntity<>("No courses available", HttpStatus.NOT_FOUND);
		}

		return new ResponseEntity<>(courses, HttpStatus.OK);
	}

	@GetMapping("/coursenames-by-category")
	public ResponseEntity<List<String>> getCourseNamesByCategory(@RequestParam String categoryName) {
		List<String> courseNames = repo.findCourseNamesByCategory(categoryName);
		return ResponseEntity.ok(courseNames);
	}

	@GetMapping("/shortCourse")
	public ResponseEntity<String> checkShortCourse(@RequestParam String shortCourse) {
		if (repo.existsByShortCourse(shortCourse)) {
			throw new ResourceNotFoundException("ShortCourse already exists in the system");
		}
		return ResponseEntity.ok("ShortCourse is available");
	}

	@GetMapping("/names-and-categories")

	public List<Map<String, String>> getCourseNamesCategoriesAndImages() {
		List<Object[]> results = repo.findAllCourseNamesCategoriesAndImages();

		List<Map<String, String>> courses = new ArrayList<>();
		for (Object[] row : results) {
			Map<String, String> courseMap = new HashMap<>();
			courseMap.put("courseName", (String) row[0]);
			courseMap.put("courseCategory", (String) row[1]);
			courseMap.put("courseImage", (String) row[2]);
			courses.add(courseMap);
		}
		return courses;
	}

	@GetMapping("/getByCourseName/{courseName}")
	public List<Course> getCoursesByName(@PathVariable("courseName") String courseName) {
		return repo.findByCourseName(courseName);
	}

}
