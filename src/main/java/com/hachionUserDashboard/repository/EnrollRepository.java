package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.Enroll;

public interface EnrollRepository extends JpaRepository<Enroll, Integer> {

	List<Enroll> findByEmail(String email);

	@Query(value = "SELECT DISTINCT course_name FROM enroll", nativeQuery = true)
	List<String> findAllCourseNames();

	@Query(value = "SELECT student_id, name, email, mobile, course_name FROM enroll WHERE (:studentId IS NULL OR student_id = :studentId) AND (:email IS NULL OR email = :email) AND (:mobile IS NULL OR mobile = :mobile)", nativeQuery = true)
	List<Object[]> findStudentCourseInfo(String studentId, String email, String mobile);

	@Query(value = "SELECT DISTINCT student_id FROM enroll WHERE course_name = :courseName", nativeQuery = true)
	List<String> findStudentIdsByCourseName(@Param("courseName") String courseName);
	
	@Query(value = "SELECT DISTINCT batch_id FROM enroll WHERE batch_id IS NOT NULL AND (:studentId IS NULL OR student_id = :studentId) AND (:email IS NULL OR email = :email)", nativeQuery = true)
	List<String> findBatchIdsByStudentIdAndEmail(@Param("studentId") String studentId, @Param("email") String email);

}
