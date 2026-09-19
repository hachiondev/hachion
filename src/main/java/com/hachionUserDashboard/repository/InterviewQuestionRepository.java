package com.hachionUserDashboard.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.hachionUserDashboard.entity.InterviewQuestion;

public interface InterviewQuestionRepository extends JpaRepository<InterviewQuestion, Long> {

	@Query(value = "SELECT * FROM interview_question " + "WHERE interview_template_id = :templateId "
			+ "ORDER BY display_order ASC", nativeQuery = true)
	List<InterviewQuestion> findByTemplateIdOrderByDisplayOrder(Long templateId);
}