package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hachionUserDashboard.entity.CourseCategory;

@Repository
public interface CourseCategoryRepository extends CrudRepository<CourseCategory, Long> {
	boolean existsByName(String name); // Check if category exists by name

	@Query(value = "SELECT id, name, date FROM course_category ORDER BY name ASC", nativeQuery = true)
	List<CourseCategory> findAllByOrderByNameAsc();

	@Modifying
	@Transactional
	@Query(value = "UPDATE blogs SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateBlogsCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE certificate SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateCertificateCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE corporate_review SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateCorporateReviewCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE corporatecourse SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateCorporateCourseCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE course_tools SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateCourseToolsCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE curriculum SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateCurriculumCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE demovideo SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateDemoVideoCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE faq SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateFaqCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE geo_keyword_group SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateGeoKeywordCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE regularvideo SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateRegularVideoCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE resume SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateResumeCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE review SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateReviewCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE summerevents SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateSummerEventsCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE trainer SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateTrainerCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE trendingcourse SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateTrendingCourseCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE upload_images_category SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateUploadImagesCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE userreview SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateUserReviewCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE videoaccess SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateVideoAccessCategory(@Param("oldName") String oldName, @Param("newName") String newName);

	@Modifying
	@Transactional
	@Query(value = "UPDATE workshopschedule SET category_name = :newName WHERE TRIM(LOWER(category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateWorkshopScheduleCategory(@Param("oldName") String oldName, @Param("newName") String newName);
	
	@Modifying
	@Transactional
	@Query(value = "UPDATE course SET course_category = :newName WHERE TRIM(LOWER(course_category)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateCourseTableCategory(@Param("oldName") String oldName,
	                              @Param("newName") String newName);
	
	@Modifying
	@Transactional
	@Query(value = "UPDATE schedule SET schedule_category_name = :newName WHERE TRIM(LOWER(schedule_category_name)) = TRIM(LOWER(:oldName))", nativeQuery = true)
	int updateScheduleTableCategory(@Param("oldName") String oldName,
	                              @Param("newName") String newName);
}
