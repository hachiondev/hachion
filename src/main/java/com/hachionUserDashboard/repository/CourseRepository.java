package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Course;

@Repository
public interface CourseRepository extends JpaRepository<Course, Integer> {

	@Query(value = "SELECT * FROM course WHERE course_category = :courseCategory", nativeQuery = true)
	List<Course> findCoursesByCategory(@Param("courseCategory") String courseCategory);

	@Query(value = "SELECT amount FROM course WHERE course_name = :courseName", nativeQuery = true)
	Double findAmountByCourseName(@Param("courseName") String courseName);

	@Query(value = "SELECT course_name FROM course WHERE course_category = :courseCategory", nativeQuery = true)
	List<String> findCourseNamesByCategory(@Param("courseCategory") String courseCategory);

	@Query(value = "SELECT short_course FROM course WHERE course_name = :courseName LIMIT 1", nativeQuery = true)
	String findShortCourseByCourseName(@Param("courseName") String courseName);

	@Query("SELECT COUNT(c) > 0 FROM Course c WHERE c.shortCourse = :shortCourse")
	boolean existsByShortCourse(@Param("shortCourse") String shortCourse);
}
