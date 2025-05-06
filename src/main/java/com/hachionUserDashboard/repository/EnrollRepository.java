package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hachionUserDashboard.entity.Enroll;

public interface EnrollRepository extends JpaRepository<Enroll, Integer> {

	List<Enroll> findByEmail(String email);

	@Query(value = "SELECT DISTINCT course_name FROM enroll", nativeQuery = true)
	List<String> findAllCourseNames();

}
