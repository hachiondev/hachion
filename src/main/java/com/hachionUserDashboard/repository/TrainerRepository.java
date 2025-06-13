package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Trainer;

@Repository
public interface TrainerRepository extends JpaRepository <Trainer,Integer>{

	 @Query("SELECT t.summary FROM Trainer t WHERE t.trainer_name = :trainerName")
	    String findSummaryByTrainerName(@Param("trainerName") String trainerName);
	
	 @Query("SELECT COUNT(t) > 0 FROM Trainer t WHERE t.trainer_name = :trainerName AND t.category_name = :categoryName AND t.course_name = :courseName")
	 boolean existsByNameAndCategoryAndCourse(@Param("trainerName") String trainerName,
	                                          @Param("categoryName") String categoryName,
	                                          @Param("courseName") String courseName);

}
