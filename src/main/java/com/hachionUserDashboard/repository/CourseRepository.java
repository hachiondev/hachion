package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hachionUserDashboard.entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

	@Query(value = "SELECT * FROM course WHERE course_category = :courseCategory AND (course_status IS NULL OR TRIM(course_status) = '' OR LOWER(course_status) = 'active')", nativeQuery = true)
	List<Course> findCoursesByCategory(@Param("courseCategory") String courseCategory);

	
	@Query(value = "SELECT total, itotal FROM course WHERE course_name = :courseName AND (course_status IS NULL OR TRIM(course_status) = '' OR LOWER(course_status) = 'active')", nativeQuery = true)
	List<Object[]> findAmountsByCourseName(@Param("courseName") String courseName);

	@Query(value = "SELECT course_name FROM course WHERE course_category = :courseCategory AND (course_status IS NULL OR TRIM(course_status) = '' OR LOWER(course_status) = 'active')", nativeQuery = true)
	List<String> findCourseNamesByCategory(@Param("courseCategory") String courseCategory);

	// ✅ ADDED course_status
	@Query(value = "SELECT short_course FROM course WHERE course_name = :courseName AND (course_status IS NULL OR TRIM(course_status) = '' OR LOWER(course_status) = 'active') LIMIT 1", nativeQuery = true)
	String findShortCourseByCourseName(@Param("courseName") String courseName);

	@Query("SELECT COUNT(c) > 0 FROM Course c WHERE c.shortCourse = :shortCourse")
	boolean existsByShortCourse(@Param("shortCourse") String shortCourse);

	// ✅ ADDED course_status
	@Query(value = "SELECT course_name FROM course WHERE (course_status IS NULL OR TRIM(course_status) = '' OR LOWER(course_status) = 'active')", nativeQuery = true)
	List<String> findAllCourseNames();

	@Query(value = "SELECT course_name, course_category, course_image FROM course WHERE (course_status IS NULL OR TRIM(course_status) = '' OR LOWER(course_status) = 'active')", nativeQuery = true)
	List<Object[]> findAllCourseNamesCategoriesAndImages();

	// ✅ ADDED course_status
	@Query(value = "SELECT c.iamount, c.idiscount, c.itotal FROM course c WHERE c.course_name = :courseName AND (c.course_status IS NULL OR TRIM(c.course_status) = '' OR LOWER(c.course_status) = 'active')", nativeQuery = true)
	List<Object[]> findCourseFeeByCourseName(@Param("courseName") String courseName);

	// ✅ ADDED course_status
	@Query(value = "SELECT * FROM course WHERE course_name = :courseName AND (course_status IS NULL OR TRIM(course_status) = '' OR LOWER(course_status) = 'active')", nativeQuery = true)
	List<Course> findByCourseName(@Param("courseName") String courseName);

	// ✅ ADDED course_status
	@Query(value = """
			SELECT *
			FROM course
			WHERE id IN (:ids)
			AND (course_status IS NULL OR TRIM(course_status) = '' OR LOWER(course_status) = 'active')
			""", nativeQuery = true)
	List<Course> findByIdInNative(@Param("ids") List<Integer> ids);

	// ✅ ADDED course_status
	@Query(value = """
			SELECT c.*
			FROM course c
			JOIN user_wishlist uw ON uw.course_id = c.id
			WHERE uw.email = :email
			AND (c.course_status IS NULL OR TRIM(c.course_status) = '' OR LOWER(c.course_status) = 'active')
			ORDER BY uw.created_at DESC
			""", nativeQuery = true)
	List<Course> findCoursesByEmailNative(@Param("email") String email);

	@Query(value = """
				SELECT
			    id,
			    course_name,
			    seo_h1_title,
			    course_image,
			    number_of_classes,
			    level,
			    amount,
			    discount,
			    total,
			    iamount,
			    idiscount,
			    itotal,
			    course_category
			FROM course
			WHERE (course_status IS NULL OR TRIM(course_status) = '' OR LOWER(course_status) = 'active')
			""", nativeQuery = true)
	List<Object[]> findAllSummaryNative();

	// ❌ SKIPPED (as discussed — validation query)
	@Query(value = """
			    SELECT COUNT(*)
			    FROM course
			    WHERE LOWER(course_category) = LOWER(:courseCategory)
			      AND LOWER(course_name) = LOWER(:courseName)
			""", nativeQuery = true)
	long existsByCategoryAndCourseName(@Param("courseCategory") String courseCategory,
			@Param("courseName") String courseName);

	// ✅ ADDED course_status (JPQL)
	@Query("select c.numberOfClasses from Course c where c.courseName = :courseName AND (c.courseStatus IS NULL OR TRIM(c.courseStatus) = '' OR LOWER(c.courseStatus) = 'active')")
	Optional<String> findNumberOfClassesByCourseName(@Param("courseName") String courseName);

	// ✅ ADDED course_status
	@Query(value = "SELECT number_of_classes FROM course WHERE course_name = :courseName AND (course_status IS NULL OR TRIM(course_status) = '' OR LOWER(course_status) = 'active') LIMIT 1", nativeQuery = true)
	String findAboutCourseByCourseName(@Param("courseName") String courseName);

	@Query(value = "SELECT * FROM course WHERE (course_status IS NULL OR TRIM(course_status) = '' OR LOWER(course_status) = 'active')", nativeQuery = true)
	List<Course> findAllActiveCourses();

	@Modifying
	@Transactional
	@Query(value = "UPDATE corporatecourse SET course_name = :newName WHERE course_name = :oldName", nativeQuery = true)
	int updateCorporateCourse(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE course_tools SET course_name = :newName WHERE course_name = :oldName", nativeQuery = true)
	int updateCourseTools(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE curriculum SET course_name = :newName WHERE course_name = :oldName", nativeQuery = true)
	int updateCurriculum(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE demovideo SET course_name = :newName WHERE course_name = :oldName", nativeQuery = true)
	int updateDemoVideo(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE faq SET course_name = :newName WHERE course_name = :oldName", nativeQuery = true)
	int updateFaq(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE geo_keyword_group SET course_name = :newName WHERE course_name = :oldName", nativeQuery = true)
	int updateGeoKeyword(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE corporate_review SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateCorporateReview(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE project SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateProject(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE registerstudent SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateRegisterStudent(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE requestbatch SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateRequestBatch(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE trainer SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateTrainer(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE review SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateReview(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE trendingcourse SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateTrendingCourse(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE userreview SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateUserReview(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE videoaccess SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateVideoAccess(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE summerevents SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateSummerEvents(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE resume SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateResume(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE regularvideo SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateRegularVideo(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE certificate SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateCertificate(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE certificate_details SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateCertificateDetails(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE course SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateCourseTable(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE enroll SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateEnroll(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE payment_transactions SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updatePaymentTransactions(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE payments SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updatePayments(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE student_tracking SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateStudentTracking(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE upload_images_category SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateUploadImagesCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE workshop SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateWorkshop(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE workshopschedule SET course_name = :newName WHERE TRIM(LOWER(course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateWorkshopSchedule(@Param("oldName") String oldName, @Param("newName") String newName);
	
	@Modifying
	@Transactional
	@Query(value = "UPDATE schedule SET schedule_course_name = :newName WHERE TRIM(LOWER(schedule_course_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateScheduleTableCourse(@Param("oldName") String oldName,
	                              @Param("newName") String newName);

}