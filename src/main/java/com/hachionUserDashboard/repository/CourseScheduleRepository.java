package com.hachionUserDashboard.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.CourseSchedule;

import jakarta.transaction.Transactional;

@Repository
public interface CourseScheduleRepository extends JpaRepository<CourseSchedule, Integer> {

//	@Modifying
//	@Transactional
//	@Query("DELETE FROM CourseSchedule cs WHERE cs.schedule_date < :todayDateInUtc")
//	int deletePastWorkshops(@Param("todayDateInUtc") String todayDateInUtc);

//	@Modifying
//	@Transactional
//	@Query(value = """
//	    DELETE FROM schedule 
//	    WHERE schedule_mode = 'Live Demo' AND  
//	      STR_TO_DATE(CONCAT(schedule_date, ' ', LOWER(schedule_time)), '%Y-%m-%d %h:%i %p') 
//	      < STR_TO_DATE(:currentDateTime, '%Y-%m-%d %h:%i %p')
//	      OR
//      (
//        schedule_mode = 'Live Class' AND  
//        DATE_ADD(STR_TO_DATE(schedule_date, '%Y-%m-%d'), INTERVAL 3 DAY) 
//        < STR_TO_DATE(:currentDateTime, '%Y-%m-%d %h:%i %p')
//      )
//	""", nativeQuery = true)
//	int deletePastWorkshops(@Param("currentDateTime") String currentDateTime);

	@Modifying
	@Transactional
	@Query(value = """
			    UPDATE schedule
			    SET is_active = FALSE
			    WHERE
			      (schedule_mode = 'Live Demo' AND
			       STR_TO_DATE(CONCAT(schedule_date, ' ', LOWER(schedule_time)), '%Y-%m-%d %h:%i %p')
			       < STR_TO_DATE(:currentDateTime, '%Y-%m-%d %h:%i %p'))
			      OR
			      (schedule_mode = 'Live Class' AND
			       DATE_ADD(STR_TO_DATE(schedule_date, '%Y-%m-%d'), INTERVAL 3 DAY)
			       < STR_TO_DATE(:currentDateTime, '%Y-%m-%d %h:%i %p'))
			""", nativeQuery = true)
	int disablePastWorkshops(@Param("currentDateTime") String currentDateTime);

	@Query(value = "SELECT DISTINCT schedule_course_name FROM schedule", nativeQuery = true)
	List<String> findAllCourseNames();

	@Query(value = "SELECT * FROM schedule WHERE is_active = true", nativeQuery = true)
	List<CourseSchedule> findAllActiveSchedules();

	@Query("SELECT COUNT(s), s.schedule_date FROM CourseSchedule s WHERE s.batchId = :batchId GROUP BY s.schedule_date")
	List<Object[]> findCountAndScheduleDateListByBatchId(@Param("batchId") String batchId);

	
	@Query("SELECT c.numberOfClasses FROM Course c JOIN CourseSchedule s ON c.courseName = s.schedule_course_name WHERE s.batchId = :batchId")
	String findNumberOfClassesByBatchId(@Param("batchId") String batchId);
	
	@Query(value = "SELECT batch_id FROM schedule WHERE batch_id = :batchId", nativeQuery = true)
	String findExactBatchId(@Param("batchId") String batchId);


}