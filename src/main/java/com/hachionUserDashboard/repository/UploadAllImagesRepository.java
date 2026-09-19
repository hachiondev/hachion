package com.hachionUserDashboard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.UploadAllImages;

public interface UploadAllImagesRepository extends JpaRepository<UploadAllImages, Long> {

	@Query(value = "SELECT COUNT(*) " + "FROM upload_all_images i "
			+ "JOIN upload_images_category c ON i.upload_images_category_id = c.upload_images_category_id "
			+ "WHERE i.file_name = :fileName " + "AND c.category_name = :categoryName "
			+ "AND c.course_name = :courseName", nativeQuery = true)
	Long countByFileNameAndCategoryAndCourse(@Param("fileName") String fileName,
			@Param("categoryName") String categoryName, @Param("courseName") String courseName);

	@Query(value = "SELECT * FROM upload_all_images u WHERE u.file_name = :fileName LIMIT 1", nativeQuery = true)
	Optional<UploadAllImages> findByFileName(@Param("fileName") String fileName);

}
