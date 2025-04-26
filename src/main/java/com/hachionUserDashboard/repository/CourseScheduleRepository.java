package com.hachionUserDashboard.repository;

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
	    WHERE 
	      STR_TO_DATE(CONCAT(schedule_date, ' ', LOWER(schedule_time)), '%Y-%m-%d %h:%i %p') 
	      < STR_TO_DATE(:currentDateTime, '%Y-%m-%d %h:%i %p')
	""", nativeQuery = true)
	int deletePastWorkshops(@Param("currentDateTime") String currentDateTime);


}