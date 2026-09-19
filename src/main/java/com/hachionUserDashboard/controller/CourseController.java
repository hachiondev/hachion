package com.hachionUserDashboard.controller;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.hachionUserDashboard.entity.Course;
import com.hachionUserDashboard.entity.Trainer;
import com.hachionUserDashboard.exception.ResourceNotFoundException;
import com.hachionUserDashboard.repository.CourseRepository;
import com.hachionUserDashboard.repository.CourseScheduleRepository;
import com.hachionUserDashboard.repository.TrainerRepository;

@CrossOrigin
@RestController
@RequestMapping("/courses")
public class CourseController {

	@Autowired
	private CourseRepository repo;

	@Autowired
	private TrainerRepository trainerRepository;

	@Autowired
	private CourseScheduleRepository courseScheduleRepository;

	@GetMapping("/{id}")
	public ResponseEntity<Course> getCourse(@PathVariable Integer id) {
		return repo.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.status(HttpStatus.NOT_FOUND).build());
	}

	@GetMapping("/allforadmin")
	public List<Course> getAllCourseForAdmin() {
		return repo.findAll();
	}

	@GetMapping("/all")
	public List<Course> getAllCourse() {
		return repo.findAllActiveCourses();
	}

	@GetMapping("/summary")
	public List<Object[]> getCourseSummaries() {
		return repo.findAllSummaryNative();
	}

	private static final String HOME_UPLOADS = System.getProperty("user.home") + "/uploads";

	// file.upload-dir is already correctly profile-scoped (test ->
	// /home/ec2-user/uploads/test/, prod -> /home/ec2-user/uploads/prod/), so
	// course images are derived from it instead of a hardcoded "test" folder.
	@Value("${file.upload-dir}")
	private String uploadDir;

	private String courseImageDir() {
		return uploadDir + "courses/images";
	}

	private String courseImagePublicPrefix() {
		String normalized = uploadDir.replaceAll("/+$", "");
		String envSegment = Paths.get(normalized).getFileName().toString();
		return "uploads/" + envSegment + "/courses/images/";
	}

	private String saveImage(MultipartFile image) throws IOException {
		if (image == null || image.isEmpty())
			return null;

		File dir = new File(courseImageDir());
		if (!dir.exists() && !dir.mkdirs() && !dir.exists())
			throw new IOException("Could not create upload directory: " + dir.getAbsolutePath());

		String original = image.getOriginalFilename();
		String base = (original == null ? "img_" + System.currentTimeMillis() + ".png" : original);

		base = Paths.get(base).getFileName().toString();

		// Prefixed with a UUID so replacing an existing course's image never
		// collides with (and overwrites) whatever file is already on disk
		// under that same original filename.
		String safeName = UUID.randomUUID() + "_" + base.replaceAll("\\s+", "_").replaceAll("[^A-Za-z0-9._-]", "");

		Path imagePath = Paths.get(dir.getAbsolutePath(), safeName);
		Files.write(imagePath, image.getBytes());

		return courseImagePublicPrefix() + safeName;
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

			Course savedCourse = repo.save(course);
			Trainer trainer = new Trainer();
			trainer.setTrainer_name("Hachion Certified Trainer");
			trainer.setCategory_name(savedCourse.getCourseCategory());
			trainer.setCourse_name(savedCourse.getCourseName());
			trainer.setTrainerRating(4.0);
			trainer.setDate(LocalDate.now());
			trainer.setDesignation("Senior Industry Trainer & Subject Matter Expert");
			trainer.setExperience(10);
			trainer.setExperienceCredentials("Industry-experienced professional with strong domain expertise\n"
					+ "Hands-on exposure to real-time projects and enterprise-level applications\n"
					+ "Expertise in practical, scenario-based learning approaches\n"
					+ "Strong understanding of end-to-end software development and delivery processes\n"
					+ "Experience working in Agile / Scrum-based environments\n"
					+ "Proven track record of mentoring students and professionals for job readiness");
			trainer.setSummary(
					"<p>Our expert trainer represents Hachion's pool of certified industry professionals with extensive experience in delivering high-quality, job-oriented online training. Known for clear explanations, practical examples, and strong learner engagement, the sessions focus on real-world use cases, hands-on practice, and industry best practices.</p>"
							+ "<p>Training is structured, interactive, and aligned with current market demands to ensure learners gain both conceptual clarity and practical confidence.</p>");

			trainerRepository.save(trainer);

			return ResponseEntity.status(HttpStatus.CREATED).body("Course and default trainer added successfully.");
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body("Error adding course: " + e.getMessage());
		}
	}

	@PostMapping("/addCourseDetails")
	public ResponseEntity<String> addCourseDetails(@RequestPart("course") String courseData,
			@RequestPart("courseImage") MultipartFile courseImage) {

		try {
			ObjectMapper objectMapper = new ObjectMapper();
			objectMapper.registerModule(new JavaTimeModule());

			Course course = objectMapper.readValue(courseData, Course.class);

			// ✅ Adjusted uniqueness check (COUNT > 0)
			boolean exists = repo.existsByCategoryAndCourseName(course.getCourseCategory(), course.getCourseName()) > 0;

			if (exists) {
				return ResponseEntity.status(HttpStatus.CONFLICT)
						.body("Course already exists for this category. Please use a different course name.");
			}

			// ✅ Image validation
			if (courseImage == null || courseImage.isEmpty()) {
				return ResponseEntity.badRequest().body("Course image is required.");
			}

			String imagePath = saveImage(courseImage);
			if (imagePath == null) {
				return ResponseEntity.badRequest().body("Failed to save image.");
			}

			course.setCourseImage(imagePath);
			Course savedCourse = repo.save(course);
			Trainer trainer = new Trainer();
			trainer.setTrainer_name("Hachion Certified Trainer");
			trainer.setCategory_name(savedCourse.getCourseCategory());
			trainer.setCourse_name(savedCourse.getCourseName());
			trainer.setTrainerRating(4.0);
			trainer.setDate(LocalDate.now());
			trainer.setDesignation("Senior Industry Trainer & Subject Matter Expert");
			trainer.setExperience(10);
			trainer.setExperienceCredentials("Industry-experienced professional with strong domain expertise\n"
					+ "Hands-on exposure to real-time projects and enterprise-level applications\n"
					+ "Expertise in practical, scenario-based learning approaches\n"
					+ "Strong understanding of end-to-end software development and delivery processes\n"
					+ "Experience working in Agile / Scrum-based environments\n"
					+ "Proven track record of mentoring students and professionals for job readiness");
			trainer.setSummary(
					"<p>Our expert trainer represents Hachion's pool of certified industry professionals with extensive experience in delivering high-quality, job-oriented online training. Known for clear explanations, practical examples, and strong learner engagement, the sessions focus on real-world use cases, hands-on practice, and industry best practices.</p>"
							+ "<p>Training is structured, interactive, and aligned with current market demands to ensure learners gain both conceptual clarity and practical confidence.</p>");

			trainerRepository.save(trainer);

			return ResponseEntity.status(HttpStatus.CREATED).body("Course and default trainer added successfully.");

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

				String oldCourseName = course.getCourseName();

				course.setCourseCategory(updatedCourse.getCourseCategory());
				course.setCourseName(updatedCourse.getCourseName());
				course.setSeoH1Title(updatedCourse.getSeoH1Title());
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
				course.setWhatYouWillLearn(updatedCourse.getWhatYouWillLearn());
				course.setNumberOfProjects(updatedCourse.getNumberOfProjects());
				course.setWhoIsThisCourseFor(updatedCourse.getWhoIsThisCourseFor());
				course.setCareerOpportunities(updatedCourse.getCareerOpportunities());
				course.setAvarageSalaryRange(updatedCourse.getAvarageSalaryRange());
				course.setPrerequisities(updatedCourse.getPrerequisities());
				course.setLiveTraining(updatedCourse.getLiveTraining());
				course.setCrashCourse(updatedCourse.getCrashCourse());
				course.setMentoringMode(updatedCourse.getMentoringMode());
				course.setSelfPacedLearning(updatedCourse.getSelfPacedLearning());
				course.setDefaultTrainer(updatedCourse.getDefaultTrainer());

				String newStatus = updatedCourse.getCourseStatus();

				if ("Inactive".equalsIgnoreCase(newStatus)) {

					int activeSchedules = courseScheduleRepository
							.countActiveSchedules(updatedCourse.getCourseCategory(), updatedCourse.getCourseName());

					if (activeSchedules > 0) {
						return ResponseEntity.badRequest()
								.body("This course having schedule, please wait until complete that schedule");
					}
				}
				course.setCourseStatus(updatedCourse.getCourseStatus());

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

				repo.updateCorporateCourse(oldCourseName, updatedCourse.getCourseName());

				repo.updateCourseTools(oldCourseName, updatedCourse.getCourseName());

				repo.updateCurriculum(oldCourseName, updatedCourse.getCourseName());

				repo.updateDemoVideo(oldCourseName, updatedCourse.getCourseName());

				repo.updateFaq(oldCourseName, updatedCourse.getCourseName());

				repo.updateGeoKeyword(oldCourseName, updatedCourse.getCourseName());

				repo.updateCorporateReview(oldCourseName, updatedCourse.getCourseName());

				repo.updateProject(oldCourseName, updatedCourse.getCourseName());

				repo.updateReview(oldCourseName, updatedCourse.getCourseName());

				repo.updateTrendingCourse(oldCourseName, updatedCourse.getCourseName());

				repo.updateUserReview(oldCourseName, updatedCourse.getCourseName());

				repo.updateVideoAccess(oldCourseName, updatedCourse.getCourseName());

				repo.updateSummerEvents(oldCourseName, updatedCourse.getCourseName());

				repo.updateResume(oldCourseName, updatedCourse.getCourseName());

				repo.updateRegularVideo(oldCourseName, updatedCourse.getCourseName());

				repo.updateRegisterStudent(oldCourseName, updatedCourse.getCourseName());

				repo.updateRequestBatch(oldCourseName, updatedCourse.getCourseName());

				repo.updateTrainer(oldCourseName, updatedCourse.getCourseName());

				repo.updateCertificate(oldCourseName, updatedCourse.getCourseName());

				repo.updateCertificateDetails(oldCourseName, updatedCourse.getCourseName());

				repo.updateCourseTable(oldCourseName, updatedCourse.getCourseName());

				repo.updateEnroll(oldCourseName, updatedCourse.getCourseName());

				repo.updatePaymentTransactions(oldCourseName, updatedCourse.getCourseName());

				repo.updatePayments(oldCourseName, updatedCourse.getCourseName());

				repo.updateStudentTracking(oldCourseName, updatedCourse.getCourseName());

				repo.updateUploadImagesCategory(oldCourseName, updatedCourse.getCourseName());

				repo.updateWorkshop(oldCourseName, updatedCourse.getCourseName());

				repo.updateWorkshopSchedule(oldCourseName, updatedCourse.getCourseName());
				
				repo.updateScheduleTableCourse(oldCourseName, updatedCourse.getCourseName());

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
