package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hachionUserDashboard.entity.InterviewTemplate;

public interface InterviewTemplateRepository extends JpaRepository<InterviewTemplate, Long> {

	@Query(value = "SELECT * FROM interview_template WHERE is_active = true ORDER BY created_at DESC", nativeQuery = true)
	List<InterviewTemplate> findAllActive();

	@Query(value = "SELECT * FROM interview_template WHERE type = :type AND is_active = true ORDER BY created_at DESC", nativeQuery = true)
	List<InterviewTemplate> findActiveByType(String type);
}