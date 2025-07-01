package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import com.hachionUserDashboard.entity.RegisterStudent;

public interface RegisterStudentRepository extends JpaRepository<RegisterStudent, Integer> {

	RegisterStudent findByEmail(String email);

	@Query("SELECT u FROM RegisterStudent u WHERE u.email = :email")
	Optional<RegisterStudent> findByEmailForProfile(String email);

	@Query("SELECT COUNT(u) > 0 FROM RegisterStudent u WHERE u.email = :email")
	boolean existsByEmail(@Param("email") String email);

	@Query("SELECT COUNT(u) > 0 FROM RegisterStudent u WHERE u.mobile = :mobile")
	boolean existsByMobile(@Param("mobile") String mobile);

	@Query("SELECT u FROM RegisterStudent u WHERE u.email = :email")
	Optional<RegisterStudent> findBYEmailForOauth(@Param("email") String email);

	@Query("SELECT u FROM RegisterStudent u WHERE u.email = :email AND u.password = :password")
	Optional<RegisterStudent> findOneByEmailAndPassword(@Param("email") String email,
			@Param("password") String password);

	@Modifying
	@Transactional
	@Query(value = "DELETE FROM registerstudent WHERE otp_status = false", nativeQuery = true)
	int deleteExpiredOtps();

	@Query(value = "SELECT student_id FROM registerstudent WHERE student_id IS NOT NULL ORDER BY LENGTH(student_id) DESC, student_id DESC LIMIT 1", nativeQuery = true)
	String findTopByOrderByStudentIdDesc();

//	@Query(value = "SELECT u.user_name AS userName, u.student_id AS studentId, u.email " + "FROM user_tbl u "
//			+ "JOIN enroll e ON u.user_name = e.name " + "WHERE e.course_name = :courseName", nativeQuery = true)
//	List<Object[]> findUsersByCourseName(@Param("courseName") String courseName);

	@Query(value = "SELECT name, student_id, email FROM enroll WHERE course_name = :courseName", nativeQuery = true)
	List<Object[]> findUsersByCourseName(@Param("courseName") String courseName);

	@Query(value = "SELECT name, email FROM enroll WHERE student_id = :studentId", nativeQuery = true)
	List<Object[]> findUserNameEmailByStudentId(@Param("studentId") String studentId);

	@Query(value = "SELECT student_id, email FROM enroll WHERE name = :userName", nativeQuery = true)
	List<Object[]> findStudentIdEmailByUserName(@Param("userName") String userName);

	@Query(value = "SELECT e.completion_date " + "FROM enroll e "
			+ "WHERE e.course_name = :courseName AND e.name = :userName", nativeQuery = true)
	String findCompletionDateByCourseAndUser(@Param("courseName") String courseName,
			@Param("userName") String userName);

	@Query(value = "SELECT * FROM registerstudent ORDER BY date DESC", nativeQuery = true)
	List<RegisterStudent> findAllOrderByDateDescNative();

	@Query(value = "SELECT * FROM registerstudent WHERE student_id = :studentId", nativeQuery = true)
	Optional<RegisterStudent> findByStudentId(@Param("studentId") String studentId);

	
	@Modifying
    @Transactional
    @Query(value = "DELETE FROM registerstudent WHERE email = :email", nativeQuery = true)
    void deleteByEmailNative(@Param("email") String email);
}

