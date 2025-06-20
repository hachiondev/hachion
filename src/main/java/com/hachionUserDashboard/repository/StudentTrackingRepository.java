package com.hachionUserDashboard.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.hachionUserDashboard.entity.StudentTracking;

@Repository
public interface StudentTrackingRepository extends JpaRepository<StudentTracking, Long> {

	@Query(value = "SELECT * FROM student_tracking s "
			+ "WHERE (:courseCategory IS NULL OR s.course_category = :courseCategory) "
			+ "AND (:courseName IS NULL OR s.course_name = :courseName) "
			+ "AND (:batchId IS NULL OR s.batch_id = :batchId) "
			+ "AND (:batchType IS NULL OR s.batch_type = :batchType) "
			+ "AND ((:startDate IS NULL OR :endDate IS NULL) OR s.start_date BETWEEN :startDate AND :endDate)", nativeQuery = true)
	List<StudentTracking> filterStudentsNative(@Param("courseCategory") String courseCategory,
			@Param("courseName") String courseName, @Param("batchId") String batchId,
			@Param("batchType") String batchType, @Param("startDate") LocalDate startDate,
			@Param("endDate") LocalDate endDate);

	@Query(value = "SELECT DISTINCT batch_id FROM student_tracking WHERE course_category = :categoryName AND course_name = :courseName AND batch_type = :batchType", nativeQuery = true)
	List<String> findBatchIdsByFilters(@Param("categoryName") String categoryName,
			@Param("courseName") String courseName, @Param("batchType") String batchType);

	@Modifying
	@Transactional
	@Query(value = "UPDATE student_tracking SET start_date = :startDate, completed_date = :completedDate, "
			+ "no_of_sessions = :numberOfSessions, completed_sessions = :completedSessions, "
			+ "batch_status = :batchStatus, remarks = :remarks "
			+ "WHERE student_id = :studentId AND batch_id = :batchId", nativeQuery = true)
	int updateTrackingFields(@Param("startDate") LocalDate startDate, @Param("completedDate") LocalDate completedDate,
			@Param("numberOfSessions") int numberOfSessions, @Param("completedSessions") int completedSessions,
			@Param("batchStatus") String batchStatus, @Param("remarks") String remarks,
			@Param("studentId") String studentId, @Param("batchId") String batchId);

}
