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

	@Modifying
	@Transactional
	@Query("DELETE FROM CourseSchedule cs WHERE cs.schedule_date < :todayDateInUtc")
	int deletePastWorkshops(@Param("todayDateInUtc") String todayDateInUtc);

}