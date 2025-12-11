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

	@Query(value = "SELECT course_name FROM course", nativeQuery = true)
	List<String> findAllCourseNames();

	@Query(value = "SELECT course_name, course_category, course_image FROM course", nativeQuery = true)
	List<Object[]> findAllCourseNamesCategoriesAndImages();

	@Query(value = "SELECT c.iamount, c.idiscount, c.itotal FROM course c WHERE c.course_name = :courseName", nativeQuery = true)
	List<Object[]> findCourseFeeByCourseName(@Param("courseName") String courseName);

	@Query(value = "SELECT * FROM course WHERE course_name = :courseName", nativeQuery = true)
	List<Course> findByCourseName(@Param("courseName") String courseName);

	@Query(value = """
			SELECT *
			FROM course
			WHERE id IN (:ids)
			""", nativeQuery = true)
	List<Course> findByIdInNative(@Param("ids") List<Integer> ids);

	@Query(value = """
			SELECT c.*
			FROM course c
			JOIN user_wishlist uw ON uw.course_id = c.id
			WHERE uw.email = :email
			ORDER BY uw.created_at DESC
			""", nativeQuery = true)
	List<Course> findCoursesByEmailNative(@Param("email") String email);

	@Query(value = """
			SELECT
			    id,
			    course_name,
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
			""", nativeQuery = true)
	List<Object[]> findAllSummaryNative();

}
