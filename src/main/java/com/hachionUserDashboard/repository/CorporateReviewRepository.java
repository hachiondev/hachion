package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.CorporateReview;

@Repository
public interface CorporateReviewRepository extends JpaRepository<CorporateReview, Integer> {

	@Query(value = "SELECT * FROM corporate_review ORDER BY corporate_review_id DESC", nativeQuery = true)
	List<CorporateReview> findAllNative();

	// By ID
	@Query(value = "SELECT * FROM corporate_review WHERE corporate_review_id = :id", nativeQuery = true)
	Optional<CorporateReview> findByIdNative(@Param("id") int id);

	// By course name (case-insensitive exact match)
	@Query(value = "SELECT * FROM corporate_review WHERE LOWER(course_name) = LOWER(:courseName) ORDER BY corporate_review_id DESC", nativeQuery = true)
	List<CorporateReview> findByCourseNameNative(@Param("courseName") String courseName);

	// Optional: search by course name contains (case-insensitive)
	@Query(value = "SELECT * FROM corporate_review WHERE LOWER(course_name) LIKE CONCAT('%', LOWER(:courseNamePart), '%') ORDER BY corporate_review_id DESC", nativeQuery = true)
	List<CorporateReview> searchByCourseNameNative(@Param("courseNamePart") String courseNamePart);
}
