package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.UserReview;

public interface UserReviewRepository extends JpaRepository<UserReview, Integer> {
	@Query(value = "SELECT * FROM userreview ur WHERE ur.course_name = :courseName", nativeQuery = true)
	List<UserReview> findByCourseName(@Param("courseName") String courseName);

	interface RatingSumCount {
		Long getCnt();

		Double getSum();
	}

	@Query("""
			SELECT COUNT(u) AS cnt, COALESCE(SUM(u.rating), 0.0) AS sum
			FROM UserReview u
			WHERE u.trainer_name = :trainerName
			  AND u.type = TRUE
			  AND u.rating IS NOT NULL
			""")
	RatingSumCount sumAndCountForTrainer(@Param("trainerName") String trainerName);

	@Query("""
			SELECT COUNT(u) AS cnt, COALESCE(SUM(u.rating), 0.0) AS sum
			FROM UserReview u
			WHERE u.trainer_name = :trainerName
			  AND u.course_name  = :courseName
			  AND u.type = TRUE
			  AND u.rating IS NOT NULL
			""")
	RatingSumCount sumAndCountForTrainerCourse(@Param("trainerName") String trainerName,
			@Param("courseName") String courseName);

	@Query(value = "SELECT * FROM userreview WHERE type = 1 AND ((LOWER(review_type) = 'course' AND (trainer_name IS NULL OR NULLIF(TRIM(trainer_name), '') IS NULL)) OR (LOWER(review_type) = 'both'))", nativeQuery = true)
	List<UserReview> findAllByTypeTrue();
	
	 @Query(value = "SELECT * FROM userreview ur WHERE ur.trainer_name = :trainerName AND ur.course_name = :courseName", nativeQuery = true)
	    List<UserReview> findByTrainerNameAndCourseName(
	            @Param("trainerName") String trainerName,
	            @Param("courseName") String courseName);
}
