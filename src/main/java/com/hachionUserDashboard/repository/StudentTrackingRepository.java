package com.hachionUserDashboard.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.StudentTracking;

@Repository
public interface StudentTrackingRepository extends JpaRepository<StudentTracking, Long> {

//	@Query("SELECT s FROM StudentTracking s WHERE s.startDate BETWEEN :startDate AND :endDate")
//	List<StudentTracking> findAllByStartDateBetween(
//	    @Param("startDate") LocalDate startDate,
//	    @Param("endDate") LocalDate endDate
//	);

//	@Query("SELECT s FROM StudentTracking s " +
//		       "WHERE (:category IS NULL OR s.courseCategory = :category) " +
//		       "AND (:name IS NULL OR s.courseName = :name) " +
//		       "AND (:startDate IS NULL OR :endDate IS NULL OR s.startDate BETWEEN :startDate AND :endDate)")
//		List<StudentTracking> filterStudents(
//		    @Param("category") String category,
//		    @Param("name") String name,
//		    @Param("startDate") LocalDate startDate,
//		    @Param("endDate") LocalDate endDate
//		);

//	@Query("SELECT s FROM StudentTracking s " +
//		       "WHERE (:category IS NULL OR s.courseCategory = :category) " +
//		       "AND (:name IS NULL OR s.courseName = :name) " +
//		       "AND (:batchId IS NULL OR s.batchId = :batchId) " +
//		       "AND (:startDate IS NULL OR :endDate IS NULL OR s.startDate BETWEEN :startDate AND :endDate)")
//		List<StudentTracking> filterStudents(
//		    @Param("category") String category,
//		    @Param("name") String name,
//		    @Param("batchId") String batchId,
//		    @Param("startDate") LocalDate startDate,
//		    @Param("endDate") LocalDate endDate
//		);

	  @Query(value = "SELECT * FROM student_tracking s " +
	            "WHERE (:courseCategory IS NULL OR s.course_category = :courseCategory) " +
	            "AND (:courseName IS NULL OR s.course_name = :courseName) " +
	            "AND (:batchId IS NULL OR s.batch_id = :batchId) " +
	            "AND (:batchType IS NULL OR s.batch_type = :batchType) " +
	            "AND ((:startDate IS NULL OR :endDate IS NULL) OR s.start_date BETWEEN :startDate AND :endDate)",
	           nativeQuery = true)
	    List<StudentTracking> filterStudentsNative(
	            @Param("courseCategory") String courseCategory,
	            @Param("courseName") String courseName,
	            @Param("batchId") String batchId,
	            @Param("batchType") String batchType,
	            @Param("startDate") LocalDate startDate,
	            @Param("endDate") LocalDate endDate
	    );
}
