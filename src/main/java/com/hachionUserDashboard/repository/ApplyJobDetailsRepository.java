package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.hachionUserDashboard.entity.ApplyJobDetails;

@Repository
public interface ApplyJobDetailsRepository extends JpaRepository<ApplyJobDetails, Long> {

	@Query(value = "SELECT * FROM apply_job_details WHERE email = :email AND resume = :resume AND job_id = :jobId", nativeQuery = true)
	ApplyJobDetails findByEmailAndResumeAndJobId(@Param("email") String email, @Param("resume") String resume,
			@Param("jobId") String jobId);

	@Query(value = "SELECT COUNT(*) FROM apply_job_details WHERE job_id = :jobId AND email = :email", nativeQuery = true)
    Long countApplicationsByJobIdAndEmail(@Param("jobId") String jobId, @Param("email") String email);
}
