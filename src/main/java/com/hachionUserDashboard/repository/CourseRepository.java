package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Course;


@Repository
public interface CourseRepository extends JpaRepository <Course,Integer>{

	
	  @Query(value = "SELECT * FROM course WHERE course_category = :courseCategory", nativeQuery = true)
	    List<Course> findCoursesByCategory(@Param("courseCategory") String courseCategory);
}
