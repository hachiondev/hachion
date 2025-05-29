package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.CourseSchedule;

import jakarta.transaction.Transactional;


@Repository
public interface CourseScheduleRepository extends JpaRepository <CourseSchedule,Integer>{

//	@Modifying
//	@Transactional
//	@Query("DELETE FROM CourseSchedule cs WHERE cs.schedule_date < :todayDateInUtc")
//	int deletePastWorkshops(@Param("todayDateInUtc") String todayDateInUtc);

	@Modifying
	@Transactional
	@Query(value = """
	    DELETE FROM schedule 
	    WHERE schedule_mode = 'Live Demo' AND  
	      STR_TO_DATE(CONCAT(schedule_date, ' ', LOWER(schedule_time)), '%Y-%m-%d %h:%i %p') 
	      < STR_TO_DATE(:currentDateTime, '%Y-%m-%d %h:%i %p')
	      OR
      (
        schedule_mode = 'Live Class' AND  
        DATE_ADD(STR_TO_DATE(schedule_date, '%Y-%m-%d'), INTERVAL 3 DAY) 
        < STR_TO_DATE(:currentDateTime, '%Y-%m-%d %h:%i %p')
      )
	""", nativeQuery = true)
	int deletePastWorkshops(@Param("currentDateTime") String currentDateTime);

	 @Query(value = "SELECT DISTINCT schedule_course_name FROM schedule", nativeQuery = true)
	    List<String> findAllCourseNames();

}