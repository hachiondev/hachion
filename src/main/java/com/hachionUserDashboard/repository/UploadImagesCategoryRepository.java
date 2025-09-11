package com.hachionUserDashboard.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.UploadImagesCategory;

public interface UploadImagesCategoryRepository extends JpaRepository<UploadImagesCategory, Long> {

	@Query(value = "SELECT * FROM upload_images_category WHERE category_name = :categoryName AND course_name = :courseName LIMIT 1", nativeQuery = true)
	Optional<UploadImagesCategory> findByCategoryNameAndCourseName(@Param("categoryName") String categoryName,
			@Param("courseName") String courseName);
}
