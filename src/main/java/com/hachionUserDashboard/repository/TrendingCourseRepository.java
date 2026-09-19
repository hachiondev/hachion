package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hachionUserDashboard.entity.TrendingCourse;

public interface TrendingCourseRepository extends JpaRepository<TrendingCourse, Integer> {
	@Query(value = "SELECT * FROM trendingcourse WHERE status = 1", nativeQuery = true)
	List<TrendingCourse> getActiveTrendingCourses();

}
