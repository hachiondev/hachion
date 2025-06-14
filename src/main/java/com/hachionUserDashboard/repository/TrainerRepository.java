package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.Trainer;

@Repository
public interface TrainerRepository extends JpaRepository<Trainer, Integer> {

//	@Query("SELECT t.summary FROM Trainer t WHERE t.trainer_name = :trainerName")
//	String findSummaryByTrainerName(@Param("trainerName") String trainerName);
	
	@Query("SELECT t.summary FROM Trainer t WHERE t.trainer_name = :trainerName AND t.course_name = :courseName")
	String findSummaryByTrainerNameAndCourse(@Param("trainerName") String trainerName, @Param("courseName") String courseName);


	@Query("SELECT COUNT(t) > 0 FROM Trainer t WHERE t.trainer_name = :trainerName AND t.category_name = :categoryName AND t.course_name = :courseName")
	boolean existsByNameAndCategoryAndCourse(@Param("trainerName") String trainerName,
			@Param("categoryName") String categoryName, @Param("courseName") String courseName);

	@Query(value = "Select trainer_name from trainer where category_name =:categoryName and course_name =:courseName", nativeQuery = true)
	List<String> gettingTrainerNames(@Param("categoryName") String categoryName,
			@Param("courseName") String courseName);

}
