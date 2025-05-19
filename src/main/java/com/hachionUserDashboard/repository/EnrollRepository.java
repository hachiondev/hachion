package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hachionUserDashboard.entity.Enroll;

public interface EnrollRepository extends JpaRepository<Enroll, Integer> {

	List<Enroll> findByEmail(String email);

	@Query(value = "SELECT DISTINCT course_name FROM enroll", nativeQuery = true)
	List<String> findAllCourseNames();

	@Query(value = "SELECT student_id, name, email, mobile, course_name FROM enroll WHERE (:studentId IS NULL OR student_id = :studentId) AND (:email IS NULL OR email = :email) AND (:mobile IS NULL OR mobile = :mobile)", nativeQuery = true)

//	@Query(value = "SELECT student_id, name, email, mobile, course_name FROM enroll WHERE (:studentId IS NULL OR student_id = :studentId) OR (:email IS NULL OR email = :email) OR (:mobile IS NULL OR mobile = :mobile)", nativeQuery = true)
	List<Object[]> findStudentCourseInfo(String studentId, String email, String mobile);
}
