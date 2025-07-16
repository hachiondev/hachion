package com.hachionUserDashboard.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hachionUserDashboard.entity.HireFromUs;

public interface HireFromUsRepository extends JpaRepository<HireFromUs, Long> {

	@Query("SELECT MAX(h.jobId) FROM HireFromUs h")
	String findMaxJobId();

}
