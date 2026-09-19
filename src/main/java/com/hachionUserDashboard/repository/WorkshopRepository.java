package com.hachionUserDashboard.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jdbc.repository.query.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Workshop;

import jakarta.transaction.Transactional;

@Repository
public interface WorkshopRepository extends JpaRepository<Workshop, Long> {

//	public Workshop createWorkshop(Workshop workshop);

	Optional<Workshop> getByWorkshopId(Long workshopId);

	@Query("SELECT w FROM Workshop w")
	List<Workshop> getAllWorkshops();


//	@Modifying
//	@Transactional
//	public Workshop updateWorkshop(Workshop workshop);

	
	@Modifying
	@Query("UPDATE Workshop w SET w.courseName = :courseName, w.courseCategory = :courseCategory, w.date = :date, w.time = :time, w.timeZone = :timeZone WHERE w.workshopId = :workshopId")
	Workshop updateWorkshop(@Param("workshopId") Long workshopId, 
	                        @Param("courseName") String courseName, 
	                        @Param("courseCategory") String courseCategory, 
	                        @Param("date") String date, 
	                        @Param("time") String time, 
	                        @Param("timeZone") String timeZone);
	
//	@Query("SELECT w FROM Workshop w WHERE w.workshopCategory = :courseCategory")
//	Optional<Workshop> getByWorkshopCategory(@Param("courseCategory") String courseCategory);

	@Modifying
	@Transactional
	void deleteById(Long workshopId);
}
