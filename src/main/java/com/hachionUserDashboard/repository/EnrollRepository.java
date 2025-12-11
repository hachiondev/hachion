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

//	@Query(value = "SELECT DISTINCT batch_id FROM enroll WHERE batch_id IS NOT NULL AND (:studentId IS NULL OR student_id = :studentId) AND (:email IS NULL OR email = :email)", nativeQuery = true)
//	List<String> findBatchIdsByStudentIdAndEmail(@Param("studentId") String studentId, @Param("email") String email);
	@Query(value = """
			SELECT DISTINCT batch_id
			FROM enroll
			WHERE batch_id IS NOT NULL
			  AND (:studentId IS NULL OR student_id = :studentId)
			  AND (:email IS NULL OR email = :email)
			  AND (:courseName IS NULL OR course_name = :courseName)
			""", nativeQuery = true)
	List<String> findBatchIdsByStudentIdAndEmail(@Param("studentId") String studentId, @Param("email") String email,
			@Param("courseName") String courseName);

	@Query(value = "SELECT COUNT(*) FROM enroll WHERE student_id = :studentId AND LOWER(TRIM(course_name)) = LOWER(TRIM(:courseName)) AND LOWER(mode) = 'live class' AND batch_id = :batchId", nativeQuery = true)
	int countLiveClassEnrollment(@Param("studentId") String studentId, @Param("courseName") String courseName,
			@Param("batchId") String batchId);

	@Query(value = "SELECT COUNT(*) FROM enroll WHERE student_id = :studentId AND course_name = :courseName AND batch_id = :batchId AND mode = 'Live Class'", nativeQuery = true)
	int countByStudentCourseBatchAndModeLiveClass(@Param("studentId") String studentId,
			@Param("courseName") String courseName, @Param("batchId") String batchId);

	@Query(value = "SELECT COUNT(*) FROM enroll WHERE student_id = :studentId AND course_name = :courseName AND batch_id = :batchId", nativeQuery = true)
	Long countEnrollments(@Param("studentId") String studentId, @Param("courseName") String courseName,
			@Param("batchId") String batchId);

	@Query(value = "SELECT * FROM enroll ORDER BY enroll_date DESC", nativeQuery = true)
	List<Enroll> findAllByOrderByEnrollDateDesc();

	@Query(value = "SELECT COUNT(*) FROM enroll WHERE email = :email", nativeQuery = true)
	long countByEmail(@Param("email") String email);

	@Query(value = "SELECT enroll_date FROM enroll WHERE email = :email ORDER BY STR_TO_DATE(enroll_date, '%Y-%m-%d') DESC LIMIT 1", nativeQuery = true)
	String findLastEnrollDate(@Param("email") String email);

	@Query(value = "SELECT course_name FROM enroll WHERE email = :email ORDER BY STR_TO_DATE(enroll_date, '%Y-%m-%d') DESC LIMIT 1", nativeQuery = true)
	String findLastCourseName(@Param("email") String email);

	@Query(value = "SELECT COUNT(*) FROM enroll e WHERE e.trainer = :trainerName AND e.course_name = :courseName", nativeQuery = true)
	long countByTrainerAndCourse(@Param("trainerName") String trainerName, @Param("courseName") String courseName);

	@Query(value = "SELECT DISTINCT course_name FROM enroll WHERE email = :email", nativeQuery = true)
	List<String> findCourseNamesByEmail(@Param("email") String email);

	@Query(value = "SELECT DISTINCT trainer FROM enroll WHERE email = :email AND course_name = :courseName", nativeQuery = true)
	List<String> findTrainersByEmailAndCourse(@Param("email") String email, @Param("courseName") String courseName);

	Enroll findByEmailAndBatchId(String email, String batchId);

}
