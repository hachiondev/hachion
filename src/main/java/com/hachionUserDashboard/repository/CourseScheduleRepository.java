package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.CourseSchedule;

@Repository
public interface CourseScheduleRepository extends JpaRepository<CourseSchedule, Integer> {

//	@Modifying
//	@Query("DELETE FROM CourseSchedule c WHERE c.schedule_date < :todayDateInUtc")
//	int deletePastWorkshops(@Param("todayDateInUtc") String todayDateInUtc);
}