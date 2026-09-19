package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.JobApplication;

public interface JobApplicationRepository extends JpaRepository<JobApplication, Long> {

	@Query(value = "SELECT COUNT(*) FROM job_applications WHERE email = :email AND department = :department AND position = :position", nativeQuery = true)
	Long checkDuplicateApplication(@Param("email") String email, @Param("department") String department,
			@Param("position") String position);
}
