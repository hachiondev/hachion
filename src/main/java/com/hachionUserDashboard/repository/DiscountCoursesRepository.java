package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.DiscountCourses;

public interface DiscountCoursesRepository extends JpaRepository<DiscountCourses, Long> {

	@Query(value = "SELECT * FROM discount_courses " + "WHERE LOWER(status) = 'active' "
			+ "AND FIND_IN_SET(LOWER(:country), LOWER(country_names))", nativeQuery = true)
	List<DiscountCourses> getActiveDiscountsByCountry(@Param("country") String country);
}
