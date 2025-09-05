package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.hachionUserDashboard.entity.HireFromUs;

public interface HireFromUsRepository extends JpaRepository<HireFromUs, Long> {

	@Query("SELECT MAX(h.jobId) FROM HireFromUs h")
	String findMaxJobId();

//	 @Query(value = "SELECT * FROM hire_from_us WHERE status = :status", nativeQuery = true)
//	    List<HireFromUs> findAllByStatus(@Param("status") String status);
	 
	 @Query(value = "SELECT * FROM hire_from_us WHERE LOWER(status) = LOWER(:status)", nativeQuery = true)
	 List<HireFromUs> findAllByStatus(@Param("status") String status);

}
